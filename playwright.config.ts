// Automated browser tests (run only by .github/workflows/e2e-test.yml against
// the temporary local test Supabase; never against the live project).
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"], ["json", { outputFile: "e2e-results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
