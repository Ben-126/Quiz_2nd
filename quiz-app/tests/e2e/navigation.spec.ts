import { test, expect } from "@playwright/test";

test.describe("Navigation principale", () => {
  test("la page d'accueil affiche les 12 matières", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/QuizSeconde/);

    const matiereCards = page.locator('[data-testid="matiere-card"]');
    await expect(matiereCards).toHaveCount(12);
  });

  test("clic sur une matière mène à la liste des chapitres", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="matiere-card"]').first().click();
    await page.waitForURL(/\/(mathematiques|francais|histoire|geographie|ses|svt|physique-chimie|snt|emc|anglais|espagnol|allemand)$/);

    await expect(page.locator('[data-testid="liste-chapitres"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="chapitre-card"]').first()).toBeVisible();
  });

  test("clic sur un chapitre mène à la page quiz", async ({ page }) => {
    await page.route("/api/quiz/generate", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          questions: [
            {
              type: "vrai_faux",
              question: "Test navigation ?",
              reponseCorrecte: true,
              explication: "Explication test.",
            },
          ],
        }),
      });
    });

    await page.goto("/mathematiques");
    await page.locator('[data-testid="chapitre-card"]').first().click();
    await expect(page.locator('[data-testid="quiz-container"]')).toBeVisible({ timeout: 30000 });
  });

  test("le bouton retour dans la page chapitres fonctionne", async ({ page }) => {
    await page.goto("/mathematiques");
    await page.locator('button[aria-label="Retour"]').click();
    await page.waitForURL("/", { timeout: 10000 });
    await expect(page.locator('[data-testid="liste-matieres"]')).toBeVisible();
  });

  test("navigation directe vers une matière valide", async ({ page }) => {
    await page.goto("/svt");
    await expect(page.locator('[data-testid="liste-chapitres"]')).toBeVisible();
    const chapitres = page.locator('[data-testid="chapitre-card"]');
    await expect(chapitres).not.toHaveCount(0);
  });

  test("navigation vers une matière invalide affiche 404", async ({ page }) => {
    await page.goto("/matiere-inexistante");
    await expect(page.locator("text=Page introuvable")).toBeVisible();
  });
});
