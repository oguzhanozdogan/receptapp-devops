const request = require("supertest");
const app = require("./index");

describe("Recipe API", () => {
  test("GET /recipes returnerar lista", async () => {
    const res = await request(app).get("/recipes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /recipes/:id returnerar recept", async () => {
    // hämta lista först
    const listRes = await request(app).get("/recipes");
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    const firstId = listRes.body[0].id;

    const res = await request(app).get(`/recipes/${firstId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(firstId);
  });

  test("GET /recipes/:id med fel id ger 404", async () => {
    const res = await request(app).get("/recipes/999999");
    expect(res.status).toBe(404);
  });

  test("POST /recipes skapar recept", async () => {
    const newRecipe = {
      title: "Testrecept",
      ingredients: ["a", "b"],
      instructions: "Gör något",
      category: "test",
      cookingTime: 10,
    };

    const res = await request(app).post("/recipes").send(newRecipe);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe("Testrecept");
  });

  test("POST /recipes utan title ger 400", async () => {
    const badRecipe = {
      ingredients: ["a", "b"],
      instructions: "Gör något",
    };

    const res = await request(app).post("/recipes").send(badRecipe);
    expect(res.status).toBe(400);
  });
});
