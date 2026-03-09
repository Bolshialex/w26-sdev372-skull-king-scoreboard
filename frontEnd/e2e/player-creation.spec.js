import { test, expect } from "@playwright/test";

test.describe("Player Creation", () => {
    test("displays the player creation form with correct fields", async ({
        page,
    }) => {
        await page.goto("/player/create");

        await expect(
            page.getByRole("heading", { name: "Player Creation" })
        ).toBeVisible();

        await expect(page.getByLabel("First Name")).toBeVisible();
        await expect(page.getByLabel("Last Name")).toBeVisible();

        await expect(
            page.getByRole("button", { name: "Create Player" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Create Player" })
        ).toBeEnabled();
    });

    test("creates a new player successfully", async ({ page }) => {
        await page.goto("/player/create");
        const timestamp = Date.now();
        const firstName = `Test${timestamp}`;
        const lastName = `Player${timestamp}`;

        await page.getByLabel("First Name").fill(firstName);
        await page.getByLabel("Last Name").fill(lastName);

        await page.getByRole("button", { name: "Create Player" }).click();

        await expect(
            page.getByText(`Player profile for ${firstName} ${lastName} created successfully!`)
        ).toBeVisible({ timeout: 10_000 });

        await expect(page.getByLabel("First Name")).toHaveValue("");
        await expect(page.getByLabel("Last Name")).toHaveValue("");

        await page.goto("/players");
        await expect(
            page.getByRole("heading", { name: "All Players" })
        ).toBeVisible();
        await expect(
            page.getByText(`${firstName} ${lastName}`)
        ).toBeVisible({ timeout: 10_000 });
    });
});
