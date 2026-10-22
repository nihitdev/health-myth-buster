import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:5174", headless: true },
  webServer: {
    command: "npm run build && npm run preview -- --port 5174",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
