import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:5173";

async function gotoApp(page) {
  await page.goto(APP_URL);
  await page.waitForResponse(
    (res) => res.url().includes("/recipes") && res.status() === 200
  );
}

test("Laddar sidan och visar rubrik", async ({ page }) => {
  await gotoApp(page);
  await expect(page.getByText("Receptappen")).toBeVisible();
});

test("Visar lista med minst ett recept", async ({ page }) => {
  await gotoApp(page);
  const items = page.locator("li");
  expect(await items.count()).toBeGreaterThan(0);
});

test("Kan lägga till nytt recept", async ({ page }) => {
  await gotoApp(page);

  await page.getByLabel("Titel").fill("Playwright Recept");
  await page.getByLabel("Ingredienser").fill("salt, peppar");
  await page.getByLabel("Instruktioner").fill("instruktion text");
  await page.getByLabel("Kategori").fill("test");
  await page.getByLabel("Tillagningstid").fill("10");

  await page.getByRole("button", { name: /Spara recept/i }).click();

  const newItem = page.locator("li", { hasText: "Playwright Recept" }).first();
  await expect(newItem).toBeVisible();
});

test("Kan redigera första receptet", async ({ page }) => {
  await gotoApp(page);

  const firstTitle = page.locator("li strong").first();

  await page.getByRole("button", { name: "Redigera" }).first().click();

  await page.getByLabel("Titel").fill("Uppdaterat Recept");
  await page.getByRole("button", { name: /Uppdatera recept/i }).click();

  await expect(firstTitle).toHaveText("Uppdaterat Recept");
});

test("Kan ta bort första receptet", async ({ page }) => {
  await gotoApp(page);

  const firstTitle = page.locator("li strong").first();
  const titleText = await firstTitle.innerText();

  page.once("dialog", (dialog) => dialog.accept());

  await page.getByRole("button", { name: "Ta bort" }).first().click();

  const deletedItem = page.locator("li", { hasText: titleText }).first();

  await expect(deletedItem).toHaveCount(0);
});
