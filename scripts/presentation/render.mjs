/* global document */
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("deliverables/health-myth-buster");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});
await page.goto("file://" + path.join(root, "presentation-preview.html"), {
  waitUntil: "load",
});
await page.pdf({
  path: path.join(root, "Health_Myth_Buster_Slide_Preview.pdf"),
  width: "1280px",
  height: "720px",
  printBackground: true,
  preferCSSPageSize: true,
});
await fs.mkdir(path.join(root, "media", "slides"), { recursive: true });
for (let i = 1; i <= 9; i++)
  await page
    .locator("#slide-" + i)
    .screenshot({ path: path.join(root, "media", "slides", `slide-${i}.png`) });
const overflow = await page.evaluate(() =>
  Array.from(document.querySelectorAll(".slide")).flatMap((s, i) =>
    Array.from(s.querySelectorAll("div"))
      .filter((n) => n.scrollHeight > n.clientHeight + 8 && n.innerText.trim())
      .map((n) => ({
        slide: i + 1,
        text: n.innerText.slice(0, 80),
        overflow: n.scrollHeight - n.clientHeight,
      })),
  ),
);
console.log("Potential preview text overflow:", JSON.stringify(overflow));
try {
  await page.goto("file://" + path.join(root, "human-script.html"));
  await page.pdf({
    path: path.join(root, "Human_Pitch_Script.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
} catch (error) {
  console.log("Human script PDF not rendered:", error.message);
}
await browser.close();
