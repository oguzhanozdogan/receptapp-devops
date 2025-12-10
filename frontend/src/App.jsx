import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [cookingTime, setCookingTime] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  function loadRecipes() {
    axios
      .get("http://localhost:3000/recipes")
      .then((response) => {
        setRecipes(response.data);
        setError("");
      })
      .catch(() => {
        setError("Kunde inte ladda recept.");
      });
  }

  function resetForm() {
    setTitle("");
    setIngredients("");
    setInstructions("");
    setCategory("");
    setCookingTime("");
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !ingredients || !instructions) {
      setError("Title, ingredients och instructions krävs.");
      return;
    }

    const payload = {
      title,
      ingredients: ingredients.split(",").map((s) => s.trim()),
      instructions,
      category,
      cookingTime: cookingTime ? Number(cookingTime) : 0,
    };

    try {
      if (editingId === null) {
        await axios.post("http://localhost:3000/recipes", payload);
      } else {
        await axios.put(`http://localhost:3000/recipes/${editingId}`, payload);
      }
      resetForm();
      loadRecipes();
    } catch (err) {
      setError("Något gick fel vid sparande av recept.");
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Vill du ta bort receptet?");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:3000/recipes/${id}`);
      loadRecipes();
    } catch (err) {
      setError("Något gick fel vid borttagning.");
    }
  }

  function handleEdit(recipe) {
    setEditingId(recipe.id);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients.join(", "));
    setInstructions(recipe.instructions);
    setCategory(recipe.category);
    setCookingTime(String(recipe.cookingTime));
    setError("");
  }

  return (
    <div
      style={{ maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <h1>Receptappen</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h2>{editingId === null ? "Lägg till recept" : "Redigera recept"}</h2>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Titel:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Ingredienser (separera med komma):
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Instruktioner:
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{ width: "100%", minHeight: "60px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Kategori:
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Tillagningstid (minuter):
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">
          {editingId === null ? "Spara recept" : "Uppdatera recept"}
        </button>
        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Avbryt
          </button>
        )}
      </form>

      <h2>Befintliga recept</h2>
      {recipes.length === 0 ? (
        <p>Inga recept hittades.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ marginBottom: "10px" }}>
              <strong>{recipe.title}</strong>
              <div>Kategori: {recipe.category}</div>
              <div>Tid: {recipe.cookingTime} minuter</div>
              <button onClick={() => handleEdit(recipe)}>Redigera</button>
              <button
                onClick={() => handleDelete(recipe.id)}
                style={{ marginLeft: "8px" }}
              >
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
