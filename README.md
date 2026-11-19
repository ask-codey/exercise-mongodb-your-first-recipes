# Exercise: Your First Recipes

Exercise code for the lesson **Exercise: Your First Recipes** in the MongoDB in Depth course on [ask-codey.com](https://www.ask-codey.com).

Sunday Kitchen, a small recipe website, is moving its recipe cards into MongoDB. Three are in already: Saturday Pancakes, Weeknight Chili and Lemon Bars. You'll add two more cards with `insertOne`, then find every recipe and find one by its name with `find`. You write each one as a mongosh statement in `queries.js`, and tests run your statements and check what they add and find.

## What's here

- `queries.js`: the four functions, each returning `db.recipes.find({ name: "not written yet" })` for now, which finds nothing and adds nothing. The comment above each one says exactly what it should add or find. For you to finish.
- `data/recipes.json`: Sunday Kitchen's 3 recipes, the ones you added in the lesson *Your First Documents in mongosh*. Ready to use.
- `data/load-into-mongosh.js`: loads those recipes into mongosh, so you can try a statement there first. Ready to use.
- `test/queries.test.js`: the tests that run your statements. You don't need to change this file.
- `test/mongosh-helper.js`: the helper that runs your mongosh statements for the tests, with a throwaway MongoDB. You don't need to read or change it.
- `package.json`: the packages the tests use, and the MongoDB version they download if your computer has none. Ready to use.

The word `export` in front of each function lets the tests use it, and the `import` line at the top of `queries.js` brings in mongosh's helpers for later exercises. Leave both as they are.

## Before you start

In VS Code's terminal, in this folder, install the packages the tests use (once):

```bash
npm install
```

## Try it in mongosh

Every answer is one mongosh statement, so you can try it at the mongosh prompt before you paste it in. Start mongosh in this folder, choose a practice database, and load the recipes:

```bash
mongosh
```

```mongodb
use first_recipes
load("data/load-into-mongosh.js")
```

It prints `recipes: 3 documents`, then `true`. Then try a statement, such as `db.recipes.find()`, and type `exit` when you're done. Loading the file again puts the 3 recipes back as they were.

## Check your work

```bash
npm test
```

At first every test fails: that is expected. Each statement you finish turns its test green. A failing test's message says what it expected and what it found, for example *1) addChickpeaCurry should add a recipe named "Chickpea Curry", with that exact spelling. The collection holds 3: Saturday Pancakes, Weeknight Chili, Lemon Bars.*

The tests start their own throwaway MongoDB, so they never touch your databases. If you installed MongoDB on your computer in the course's setup lesson, the tests use it. If you didn't, the first `npm test` downloads MongoDB 9.0.8 for the tests (nearly 1 GB on Windows, about 180 MB on a Mac) and keeps it for every exercise after this one.

## The rules

- Write one mongosh statement in each function, after the word `return`, such as `return db.recipes.find();`.
- Add each recipe with exactly the three fields its comment names: `name`, `meal` and `minutes`. Don't type an `_id`: MongoDB makes one.
- Type the text in double quotes and the minutes as a number, without quotes.

## Tips

- Copy the shape of the statements in *Your First Documents in mongosh*: the recipes there have the same three fields.
- Capital letters count: `"Chickpea Curry"` and `"chickpea curry"` are different names, and `insertOne` isn't `insertone`.
- A statement that works in mongosh works here too: copy it from the prompt, then put `return` in front of it.

## Hand it in

When it works, push your solution to a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. The lesson page shows the Git commands, step by step.
