import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
    test("displays the Skull-King ScoreBoard heading and all menu buttons", async ({
        page,
    }) => {
        await page.goto("/");

        // Verify the main heading
        await expect(
            page.getByRole("heading", { name: "Skull-King ScoreBoard" })
        ).toBeVisible();

        // Verify all four menu buttons are present
        await expect(
            page.getByRole("button", { name: "Start New Game" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Continue Game" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Create New Player" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Lookup Player" })
        ).toBeVisible();
    });

    test("navigates to Create New Player page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Create New Player" }).click();

        await expect(page).toHaveURL("/player/create");
        await expect(
            page.getByRole("heading", { name: "Player Creation" })
        ).toBeVisible();
    });

    test("navigates to Start New Game page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Start New Game" }).click();

        await expect(page).toHaveURL("/game");
        await expect(
            page.getByRole("heading", { name: "Start A New Game" })
        ).toBeVisible();
    });

    test("navigates to Lookup Player page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Lookup Player" }).click();

        await expect(page).toHaveURL("/players");
        await expect(
            page.getByRole("heading", { name: "All Players" })
        ).toBeVisible();
    });
});
