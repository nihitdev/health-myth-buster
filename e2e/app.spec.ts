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
  await expect(page.getByLabel("Claim result")).toContainText("TRUE");
  expect(errors).toEqual([]);
});
test("library, local evaluation, export, baseline rerun and judge routes", async ({
  page,
}) => {
  await page.goto("/library");
  await expect(page.getByRole("status")).toContainText("36 of 36");
  await page.getByLabel("Search myth library").fill("common cold");
  await expect(page.getByRole("status")).toContainText("1 of 36");
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
test("everyday questions, reviewed negation and useful clarification", async ({
  page,
}) => {
  await page.goto("/");
  const claim = page.getByLabel("Enter a health claim");
  await claim.fill("Do antibiotics work for the flu?");
  await claim.press("Enter");
  await expect(page.getByLabel("Claim result")).toContainText("FALSE");
  await claim.fill("Vaccines do not cause autism");
  await claim.press("Enter");
  await expect(page.getByLabel("Claim result").getByRole("heading")).toHaveText(
    "Vaccines do not cause autism.",
  );
  await expect(page.getByLabel("Claim result")).toContainText("TRUE");
  await claim.fill("Antibiotics cure common illness");
  await claim.press("Enter");
  await expect(page.getByLabel("Claim result")).toContainText("UNVERIFIED");
  await expect(page.getByLabel("Claim result")).toContainText("too broad");
  await expect(page.getByLabel("Claim result")).toContainText(
    "do not verify your original statement",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByLabel("Claim result")
    .getByRole("link", { name: /Antibiotics cure the common cold/ })
    .click();
  await expect(page.getByLabel("Search myth library")).toHaveValue(
    "Antibiotics cure the common cold.",
  );
  await expect(page.getByRole("status")).toContainText("1 of 36");
});
test("one-click examples work and practice previews do not create evaluations", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /Do antibiotics work for the flu/ })
    .click();
  await expect(page.getByLabel("Enter a health claim")).toHaveValue(
    "Do antibiotics work for the flu?",
  );
  await expect(page.getByLabel("Claim result")).toContainText("FALSE");
  await page.getByRole("button", { name: "Show 4 more examples" }).click();
  await page
    .getByRole("button", { name: /Blue notebooks prevent headaches/ })
    .click();
  await expect(page.getByLabel("Claim result")).toContainText("UNVERIFIED");
  await page.goto("/testing");
  await page
    .getByRole("button", { name: /Vaccines do not cause autism/ })
    .click();
  await expect(page.getByLabel("Claim in your own words")).toHaveValue(
    "Vaccines do not cause autism.",
  );
  await expect(page.getByLabel("Claim result")).toContainText("TRUE");
  await expect(
    page.getByText("Example preview only. No evaluation has been recorded."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save evaluation" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("hmb-tests-v1")),
  ).toBeNull();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Write my own claim" }).click();
  await expect(page.getByLabel("Claim in your own words")).toHaveValue("");
  await expect(page.getByLabel("Claim in your own words")).toBeFocused();
});
