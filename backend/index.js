const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Sökväg till databasen
const dbPath = path.join(__dirname, "db.json");

// Hjälpfunktioner för att läsa och skriva
function loadRecipes() {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    const parsed = JSON.parse(data);
    return parsed.recipes || [];
  } catch (err) {
    console.error("Kunde inte läsa db.json, använder tom lista", err);
    return [];
  }
}

function saveRecipes(recipes) {
  const data = { recipes };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

// GET /recipes – hämta alla recept
app.get("/recipes", (req, res) => {
  const recipes = loadRecipes();
  res.status(200).json(recipes);
});

// GET /recipes/:id – hämta ett recept
app.get("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const recipes = loadRecipes();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return res.status(404).json({ message: "Recept hittades inte" });
  }

  res.status(200).json(recipe);
});

// POST /recipes – skapa nytt recept
app.post("/recipes", (req, res) => {
  const { title, ingredients, instructions, category, cookingTime } = req.body;

  if (!title || !ingredients || !instructions) {
    return res
      .status(400)
      .json({ message: "title, ingredients och instructions krävs" });
  }

  const recipes = loadRecipes();
  const newId =
    recipes.length > 0 ? Math.max(...recipes.map((r) => r.id)) + 1 : 1;

  const newRecipe = {
    id: newId,
    title,
    ingredients,
    instructions,
    category: category || "okänd",
    cookingTime: cookingTime || 0,
  };

  recipes.push(newRecipe);
  saveRecipes(recipes);

  res.status(201).json(newRecipe);
});

// PUT /recipes/:id – uppdatera recept
app.put("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, ingredients, instructions, category, cookingTime } = req.body;

  const recipes = loadRecipes();
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Recept hittades inte" });
  }

  if (!title || !ingredients || !instructions) {
    return res
      .status(400)
      .json({ message: "title, ingredients och instructions krävs" });
  }

  recipes[index] = {
    id,
    title,
    ingredients,
    instructions,
    category: category || recipes[index].category,
    cookingTime: cookingTime ?? recipes[index].cookingTime,
  };

  saveRecipes(recipes);

  res.status(200).json(recipes[index]);
});

// DELETE /recipes/:id – ta bort recept
app.delete("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const recipes = loadRecipes();
  const index = recipes.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Recept hittades inte" });
  }

  recipes.splice(index, 1);
  saveRecipes(recipes);

  res.status(204).send();
});

// exportera app för tester
module.exports = app;

// starta bara server om filen körs direkt
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend kör på http://localhost:${port}`);
  });
}
