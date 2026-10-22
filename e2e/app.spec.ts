import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("claim journey, caution, sources and accessible themes", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Check Claim", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Please enter");
  await page
    .getByLabel("Enter a health claim")
    .fill("Antibiotics cure the common cold.");
  await page.getByLabel("Enter a health claim").press("Enter");
  await expect(page.getByLabel("Claim result")).toContainText("FALSE");
  await expect(
    page.getByLabel("Claim result").getByText("Always ask a doctor."),
  ).toBeVisible();
  await expect(page.getByLabel("Claim result").getByRole("link")).toHaveCount(
    2,
  );
  await page.getByText("Why this matched", { exact: true }).click();
  await expect(page.getByLabel("Claim result")).toContainText("minimum 85%");
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
  });
  for (const theme of ["Switch to dark theme", "Switch to light theme"]) {
    await page.getByRole("button", { name: theme }).click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.getByRole("button", { name: "Check another claim" }).click();
  await page
    .getByLabel("Enter a health claim")
    .fill("Antibiotics do not cure colds");
  await page.getByLabel("Enter a health claim").press("Enter");
  await expect(page.getByLabel("Claim result")).toContainText("UNVERIFIED");
  expect(errors).toEqual([]);
});
test("library, local evaluation, export, baseline rerun and judge routes", async ({
  page,
}) => {
  await page.goto("/library");
  await expect(page.getByRole("status")).toContainText("12 of 12");
  await page.getByLabel("Search myth library").fill("common cold");
  await expect(page.getByRole("status")).toContainText("1 of 12");
  await page.goto("/testing");
  await expect(page.getByText("No results yet").first()).toBeVisible();
  await page
    .getByLabel("Claim in your own words")
    .fill("Antibiotics cure the common cold.");
  await page.getByLabel("Expected answer").selectOption("FALSE");
  await page.getByRole("button", { name: "Run actual checker" }).click();
  await page.getByRole("radio", { name: "Correct", exact: true }).check();
  await page.getByRole("button", { name: "Save evaluation" }).click();
  await page.reload();
  await expect(
    page.getByRole("cell", { name: "Antibiotics cure the common cold." }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("health-myth-tests.csv");
  await page.getByRole("button", { name: "Load next baseline claim" }).click();
  await expect(page.getByLabel("Evaluation phase")).toHaveValue("after");
  await expect(page.getByLabel("Claim in your own words")).toHaveValue(
    "Antibiotics cure the common cold.",
  );
  await page.goto("/presentation");
  await page.getByRole("button", { name: /Screen 2/ }).click();
  await expect(page.getByLabel("Claim result")).toContainText("FALSE");
  await page.getByRole("button", { name: /Screen 3/ }).click();
  await expect(page.getByLabel("Claim result")).toContainText("UNVERIFIED");
  for (const path of [
    "/",
    "/library",
    "/about",
    "/testing",
    "/presentation",
    "/demo",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const a = await new AxeBuilder({ page }).analyze();
    expect(a.violations).toEqual([]);
  }
});
