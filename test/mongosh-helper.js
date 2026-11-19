// The helper that runs your mongosh-style queries for the tests. Every exercise in the course has this same file.
// You don't need to read it or change it. Module 5's lesson "Testing the Data Layer with mongodb-memory-server"
// opens it up, once you know the JavaScript it uses.
//
// What it does, in order:
//   1. Starts a throwaway MongoDB for the tests (mongodb-memory-server), so your own databases are never touched.
//      If MongoDB is installed on this computer (the course's setup lesson), it uses that one. If not, the first
//      run downloads one into a cache folder, once per computer, as package.json's "config" asks.
//   2. Before every test, empties that database and loads each file in the data folder:
//      data/recipes.json becomes the recipes collection.
//   3. Calls your function with a `db` that works like mongosh's: db.recipes is the recipes collection, and
//      db.runCommand( ... ) runs a database command, such as the collMod that gives a collection its rules.
//   4. Waits for the answer. A find() becomes the list of documents it found; anything else, such as a count or
//      the result of an insert, comes back as it is.
//   5. Gives queries.js the mongosh helpers Node.js doesn't have: ObjectId("..."), ISODate("...") and
//      NumberDecimal("...").

import { before, after, beforeEach } from "node:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, ObjectId as DriverObjectId, Decimal128, BSON } from "mongodb";

// ---- mongosh's helpers, for queries.js ----

// ObjectId("6740c2b1e4b0a1b2c3d4e5f6") is a document id; ObjectId() makes a new one.
export function ObjectId(hex) {
  return new DriverObjectId(hex);
}

// ISODate("2026-11-17") is a date; ISODate() is right now.
export function ISODate(text) {
  return text === undefined ? new Date() : new Date(text);
}

// NumberDecimal("4.75") is an exact decimal number, the type for money.
export function NumberDecimal(text) {
  return Decimal128.fromString(String(text));
}

// ---- the throwaway database ----

const dataFolder = new URL("../data/", import.meta.url);
let server;
let client;
let database;

// The mongod program the course's setup lesson installs, if this computer has it.
function installedMongoDB() {
  if (process.env.MONGOMS_SYSTEM_BINARY) {
    return undefined; // you named one yourself, and mongodb-memory-server uses that
  }
  const places = ["/opt/homebrew/bin/mongod", "/usr/local/bin/mongod", "/usr/bin/mongod"]; // macOS and Linux
  const windows = "C:\\Program Files\\MongoDB\\Server"; // one folder per version, such as 9.0
  if (process.platform === "win32" && existsSync(windows)) {
    const versions = readdirSync(windows).sort((a, b) => parseFloat(b) - parseFloat(a)); // newest first
    places.unshift(...versions.map((version) => `${windows}\\${version}\\bin\\mongod.exe`));
  }
  return places.find((place) => existsSync(place));
}

// Call this once at the top of a test file: it starts the database before the tests, reloads the data before each
// test, and stops everything after the last one.
export function startTestDatabase() {
  before(async () => {
    const installed = installedMongoDB();
    server = await MongoMemoryServer.create(installed ? { binary: { systemBinary: installed } } : {});
    client = await MongoClient.connect(server.getUri());
    database = client.db("exercise");
  });

  beforeEach(async () => {
    await database.dropDatabase();
    for (const file of readdirSync(dataFolder).filter((name) => name.endsWith(".json"))) {
      // Extended JSON, so dates, ids and decimals in the data come back as their real types.
      const documents = BSON.EJSON.parse(readFileSync(new URL(file, dataFolder), "utf8"));
      await database.collection(file.replace(".json", "")).insertMany(documents);
    }
  });

  after(async () => {
    await client?.close();
    await server?.stop();
  });
}

// ---- running your function ----

// mongosh's find(filter, fields) takes the fields to show second; the driver wants them as { projection: fields }.
function shellCollection(collection) {
  return new Proxy(collection, {
    get(target, name) {
      if (name === "find" || name === "findOne") {
        return (filter = {}, fields = undefined, options = {}) => target[name](filter, { ...options, projection: fields });
      }
      const value = target[name];
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

// db.recipes, db.orders or any other name gives that collection, as in mongosh; db.runCommand( ... ) runs a command.
const db = new Proxy({}, {
  get(_, name) {
    if (name === "runCommand") {
      return (command) => database.command(command);
    }
    return typeof name === "string" ? shellCollection(database.collection(name)) : undefined;
  },
});

// Runs one of your functions and gives back its answer: the documents a find() found, or whatever else it returned.
export async function run(yourFunction) {
  const answer = yourFunction(db);
  if (typeof answer?.toArray === "function") {
    return answer.toArray(); // a find() or aggregate(): read every document it found
  }
  return await answer; // a count, or the result of an insert, update or delete
}

// Every document in a collection after your function has run, for the tests that check a change.
export async function documentsIn(collectionName) {
  return database.collection(collectionName).find().toArray();
}
