import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 30_000,
    expect: { timeout: 5_000 },

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    use: {
        baseURL: "http://localhost:80",
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chromium",
            use: { browserName: "chromium" },
        },
    ],

    webServer: {
        command: "npm run dev",
        url: "http://localhost:80",
        reuseExistingServer: !process.env.CI,
        timeout: 15_000,
    },
});
