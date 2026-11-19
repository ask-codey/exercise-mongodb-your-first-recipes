// Sunday Kitchen's first recipes: four mongosh statements for you to write.
//
// Each function gets `db`, which works like mongosh: db.recipes is Sunday Kitchen's recipes collection. When each
// test starts, the collection holds the 3 recipes you added in the lesson "Your First Documents in mongosh"
// (they're in data/recipes.json):
//
//   { name: "Saturday Pancakes", meal: "breakfast", minutes: 25 }
//   { name: "Weeknight Chili", meal: "dinner", minutes: 45 }
//   { name: "Lemon Bars", meal: "dessert", minutes: 50 }
//
// MongoDB gives each recipe its own _id when it goes in, so you never type one.
//
// In each function, replace db.recipes.find({ name: "not written yet" }) with one mongosh statement of your own,
// after the word return. Every function starts out looking for a recipe named "not written yet", which finds
// nothing and adds nothing, so its test fails until your statement is right.
// You can try a statement in mongosh first (README.md, "Try it in mongosh") and paste it in.

// mongosh's helpers for ids, dates and money. This exercise doesn't need them; leave this line as it is.
import { ObjectId, ISODate, NumberDecimal } from "./test/mongosh-helper.js";

/*
 * 1. Add the recipe card for Chickpea Curry: a dinner that takes 35 minutes.
 *
 *    Add one document with exactly these three fields: name "Chickpea Curry", meal "dinner", minutes 35.
 *    Afterward the collection holds 4 recipes.
 */
export function addChickpeaCurry(db) {
  return db.recipes.find({ name: "not written yet" });
}

/*
 * 2. Add the recipe card for Guacamole: a snack that takes 10 minutes.
 *
 *    Add one document with exactly these three fields: name "Guacamole", meal "snack", minutes 10.
 *    Afterward the collection holds 4 recipes.
 */
export function addGuacamole(db) {
  return db.recipes.find({ name: "not written yet" });
}

/*
 * 3. Find every recipe in the collection.
 *
 *    Finds the 3 recipes: Saturday Pancakes, Weeknight Chili and Lemon Bars.
 */
export function findAllRecipes(db) {
  return db.recipes.find({ name: "not written yet" });
}

/*
 * 4. Find the recipe named Weeknight Chili.
 *
 *    Finds 1 recipe: { name: "Weeknight Chili", meal: "dinner", minutes: 45 }, with its _id.
 */
export function findWeeknightChili(db) {
  return db.recipes.find({ name: "not written yet" });
}
