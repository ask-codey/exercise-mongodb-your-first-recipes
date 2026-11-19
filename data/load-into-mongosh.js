// Loads this folder's data into mongosh, so you can try your queries there before you paste them into queries.js.
// Start mongosh in the exercise folder, choose a database with use, then run: load("data/load-into-mongosh.js")
// Each .json file becomes a collection (recipes.json becomes recipes), emptied first, so running it twice is safe.
for (const file of fs.readdirSync("data").filter((name) => name.endsWith(".json"))) {
  const name = file.replace(".json", "");
  db.getCollection(name).drop();
  db.getCollection(name).insertMany(EJSON.parse(fs.readFileSync(`data/${file}`, "utf8")));
  print(`${name}: ${db.getCollection(name).countDocuments()} documents`);
}
