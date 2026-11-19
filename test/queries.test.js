// Tests for queries.js. Run them with: npm test
// Each test starts with Sunday Kitchen's 3 recipes (data/recipes.json, loaded fresh before every test), calls one of
// your functions, and checks what it found or what the collection holds afterward. You don't need to change this file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestDatabase, run, documentsIn } from "./mongosh-helper.js";
import { addChickpeaCurry, addGuacamole, findAllRecipes, findWeeknightChili } from "../queries.js";

startTestDatabase();

const startingRecipes = ["Saturday Pancakes", "Weeknight Chili", "Lemon Bars"];

// Runs a find() function and checks the recipes it found against the names expected, in any order.
async function checkFound(yourFunction, expected, message) {
  const answer = await run(yourFunction);
  assert.ok(Array.isArray(answer),
    `${yourFunction.name} should give back the recipes a find() finds, but it gave back ${answer}. Keep db.recipes.find( ... ) after return.`);
  const found = answer.map((recipe) => recipe.name).sort();
  assert.deepEqual(found, [...expected].sort(),
    `${message} Your statement found ${found.length}: ${found.join(", ") || "nothing"}.`);
}

// Runs an insert function and checks that it added exactly one recipe, with exactly the fields expected.
async function checkAdded(yourFunction, expected, number) {
  await run(yourFunction);
  const recipes = await documentsIn("recipes");
  const names = recipes.map((recipe) => recipe.name);
  const added = recipes.find((recipe) => recipe.name === expected.name);
  assert.ok(added,
    `${number}) ${yourFunction.name} should add a recipe named "${expected.name}", with that exact spelling. The collection holds ${recipes.length}: ${names.join(", ")}.`);
  assert.equal(recipes.length, 4,
    `${number}) ${yourFunction.name} should add exactly one recipe, so the collection holds 4, but it holds ${recipes.length}: ${names.join(", ")}.`);
  const { _id, ...fields } = added;
  assert.deepEqual(Object.keys(fields).sort(), ["meal", "minutes", "name"],
    `${number}) ${expected.name} should have exactly three fields, name, meal and minutes, but it has: ${Object.keys(fields).join(", ")}.`);
  assert.equal(fields.meal, expected.meal,
    `${number}) ${expected.name}'s meal should be "${expected.meal}", but it's ${JSON.stringify(fields.meal)}.`);
  assert.equal(typeof fields.minutes, "number",
    `${number}) ${expected.name}'s minutes should be the number ${expected.minutes}, written without quotes, but it's the text ${JSON.stringify(fields.minutes)}.`);
  assert.equal(fields.minutes, expected.minutes,
    `${number}) ${expected.name}'s minutes should be ${expected.minutes}, but it's ${fields.minutes}.`);
}

test("1) addChickpeaCurry adds Chickpea Curry, a dinner of 35 minutes, so the collection holds 4 recipes", async () => {
  await checkAdded(addChickpeaCurry, { name: "Chickpea Curry", meal: "dinner", minutes: 35 }, 1);
});

test("2) addGuacamole adds Guacamole, a snack of 10 minutes, so the collection holds 4 recipes", async () => {
  await checkAdded(addGuacamole, { name: "Guacamole", meal: "snack", minutes: 10 }, 2);
});

test("3) findAllRecipes finds all 3 recipes: Saturday Pancakes, Weeknight Chili and Lemon Bars", async () => {
  await checkFound(findAllRecipes, startingRecipes,
    "3) findAllRecipes should find all 3 recipes in the collection: Saturday Pancakes, Weeknight Chili and Lemon Bars.");
});

test("4) findWeeknightChili finds the 1 recipe named Weeknight Chili", async () => {
  await checkFound(findWeeknightChili, ["Weeknight Chili"],
    "4) findWeeknightChili should find only the recipe named Weeknight Chili.");
});
