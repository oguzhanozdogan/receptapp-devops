const request = require("supertest");
const app = require("./index");

describe("Recipe API", () => {
  test("GET /recipes returnerar lista", async () => {
    const res = await request(app).get("/recipes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /recipes/:id returnerar recept", async () => {
    const res = await request(app).get("/recipes/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test("GET /recipes/:id med fel id ger 404", async () => {
    const res = await request(app).get("/recipes/9999");
    expect(res.status).toBe(404);
  });

  test("POST /recipes skapar recept", async () => {
    const res = await request(app)
      .post("/recipes")
      .send({
        title: "Testrecept",
        ingredients: ["salt"],
        instructions: "Blanda",
        category: "test",
        cookingTime: 5,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Testrecept");
  });

  test("POST /recipes utan title ger 400", async () => {
    const res = await request(app)
      .post("/recipes")
      .send({
        ingredients: ["test"],
        instructions: "test",
      });
    expect(res.status).toBe(400);
  });
});
