/* global document */
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("deliverables/health-myth-buster");
const base = process.env.HMB_BASE_URL || "http://127.0.0.1:5173";
const publicUrl = "https://health-myth-buster-amber.vercel.app/";
await fs.mkdir(path.join(root, "screens"), { recursive: true });
await fs.mkdir(path.join(root, "media"), { recursive: true });
const browser = await chromium.launch({ headless: true });
const shots = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
});
await shots.goto(base, { waitUntil: "networkidle" });
await shots.addStyleTag({
  content:
    "header,footer,.hero-copy,.checker-coverage,.claim-examples,.hero~*{display:none!important}.hero{display:block;padding:24px 0}.checker{max-width:650px;margin:auto;box-shadow:none}.checker-heading{padding-bottom:14px}.checker textarea{min-height:90px} .result{animation:none}",
});
await shots
  .getByLabel("Enter a health claim")
  .fill("Antibiotics cure the common cold.");
await shots
  .locator("#checker")
  .screenshot({ path: path.join(root, "screens", "screen-1-input.png") });
await shots.getByRole("button", { name: "Check Claim", exact: true }).click();
await shots
  .getByLabel("Claim result")
  .screenshot({ path: path.join(root, "screens", "screen-2-false.png") });
await shots
  .getByLabel("Enter a health claim")
  .fill("Blue notebooks prevent headaches.");
await shots.getByRole("button", { name: "Check Claim", exact: true }).click();
await shots
  .getByLabel("Claim result")
  .screenshot({ path: path.join(root, "screens", "screen-3-unverified.png") });
await shots.goto(base + "/library", { waitUntil: "networkidle" });
await shots
  .locator("main")
  .screenshot({ path: path.join(root, "screens", "library.png") });
await shots.close();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: {
    dir: path.join(root, "media", "raw"),
    size: { width: 1280, height: 720 },
  },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#102932;color:#e8f2f1;font-family:Arial,sans-serif;width:1280px;height:720px;overflow:hidden}.orb{position:absolute;right:-150px;top:-250px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,#15685b70,transparent 67%)}header{position:absolute;top:35px;left:50px;right:50px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:12px;font-weight:700;font-size:22px}.brand img{width:42px;height:42px}.tag{font-size:13px;color:#9fd5c9;border:1px solid #38646b;padding:10px 15px;border-radius:30px}.content{position:absolute;top:115px;left:50px;right:50px;bottom:75px;display:grid;grid-template-columns:365px 1fr;gap:40px;align-items:center}.kicker{font-size:13px;letter-spacing:2px;color:#80d9c4;font-weight:700}h1{font-size:46px;line-height:1.12;letter-spacing:-1.5px;margin:18px 0;color:white}p{font-size:20px;line-height:1.6;color:#bfced0;margin:0 0 18px}.credit{font-size:15px;line-height:1.8;color:#bdd2d1}.credit strong{color:#80d9c4}.window{border:1px solid #446269;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 25px 75px #0004;height:520px}.bar{height:32px;display:flex;align-items:center;gap:6px;background:#e8f0ed;padding:0 14px;color:#526970;font-size:11px}.bar i{width:7px;height:7px;border-radius:50%;background:#a0b9b0}.bar span{margin-left:10px}iframe{border:0;width:100%;height:488px;background:white}.bottom{position:absolute;bottom:28px;left:50px;right:50px;display:flex;justify-content:space-between;font-size:12px;color:#9ebbbb}.closing .content{grid-template-columns:1fr;text-align:center;max-width:1000px;margin:auto}.closing .window{display:none}.closing h1{font-size:68px}.closing p{max-width:850px;margin:0 auto 18px}.closing .credit{font-size:18px}.rail{position:absolute;bottom:0;left:0;height:4px;width:0;background:#6fd2bc}.hide{display:none}
</style></head><body><div class="orb"></div><header><div class="brand"><img src="${base}/favicon.svg"/>healthmyth BUSTER</div><div class="tag">team_1127_0032 · AI-narrated trailer</div></header><div class="content"><div><div id="kicker" class="kicker">EVIDENCE BEFORE FORWARDS</div><h1 id="title">Check before<br/>you share.</h1><p id="body">A short look at our working health-literacy prototype.</p><div id="credit" class="credit">Built and developed by <strong>Nihit</strong><br/>Team members: Rudransh · Priyushi · Ahika</div></div><div class="window"><div class="bar"><i></i><i></i><i></i><span>Working local prototype · actual matching engine</span></div><iframe src="${base}" title="Actual Health Myth Buster application"></iframe></div></div><div class="bottom"><span>Demonstration footage · not participant testing</span><span id="safety">Always ask a doctor.</span></div><div class="rail"></div></body></html>`,
  { waitUntil: "networkidle" },
);
const frame = page.frames().find((f) => f.url().startsWith(base));
if (!frame) throw new Error("App iframe did not load");
const compact = `header,footer,.hero-copy,.checker-coverage,.claim-examples,.hero~*{display:none!important}main{padding:0 16px;max-width:100%}.hero{display:block;padding:16px 0}.checker{max-width:650px;margin:auto;padding:20px;box-shadow:none;border:0}.checker-heading h2{font-size:21px}.checker-heading p{font-size:15px}.checker textarea{min-height:100px}.input-meta{font-size:12px}.result{animation:none;margin-top:14px}.page{padding-top:18px}.page h1{font-size:34px}.lead{font-size:16px}.library-grid{grid-template-columns:1fr 1fr}.result h3{font-size:18px}.result p{font-size:16px}.result small,.sources small{font-size:12px}.sources strong{font-size:14px}.checker-foot{font-size:13px}`;
await frame.addStyleTag({ content: compact });
await page.evaluate(() => document.body.classList.add("closing"));
const start = Date.now();
const at = async (seconds) => {
  const delay = seconds * 1000 - (Date.now() - start);
  if (delay > 0) await page.waitForTimeout(delay);
};
const copy = async (kicker, title, body, closing = false) =>
  page.evaluate(
    ({ kicker, title, body, closing }) => {
      document.getElementById("kicker").textContent = kicker;
      document.getElementById("title").innerHTML = title;
      document.getElementById("body").textContent = body;
      document.body.classList.toggle("closing", closing);
      document.getElementById("credit").style.display = closing
        ? "block"
        : "none";
    },
    { kicker, title, body, closing },
  );
await at(5.5);
await copy(
  "01 · START WITH A CLAIM",
  "Type it.<br/>Or tap it.",
  "Ready-made examples make the first check simple.",
);
await frame
  .getByLabel("Enter a health claim")
  .pressSequentially("Do antibiotics work for the flu?", { delay: 35 });
await at(9.2);
await frame.getByRole("button", { name: "Check Claim", exact: true }).click();
await frame.getByLabel("Claim result").scrollIntoViewIfNeeded();
await copy(
  "02 · READ THE EVIDENCE",
  "A verdict.<br/>With sources.",
  "This reviewed claim returns FALSE, with an explanation and official references.",
);
await at(14.0);
await frame
  .getByLabel("Enter a health claim")
  .fill("Blue notebooks prevent headaches.");
await frame.getByRole("button", { name: "Check Claim", exact: true }).click();
await frame.getByLabel("Claim result").scrollIntoViewIfNeeded();
await copy(
  "03 · KNOW THE LIMITS",
  "Unknown stays<br/>UNVERIFIED.",
  "An unfamiliar claim is not automatically false. The tool does not guess.",
);
await at(19.0);
await frame.goto(base + "/library", { waitUntil: "domcontentloaded" });
await frame.addStyleTag({ content: compact });
await copy(
  "04 · OPEN THE LIBRARY",
  "36 reviewed<br/>claims.",
  "Six health categories. At least two official references per published entry.",
);
await at(24.0);
await frame.goto(base + "/about", { waitUntil: "domcontentloaded" });
await frame.addStyleTag({ content: compact });
await copy(
  "05 · TRANSPARENT BY DESIGN",
  "Rules you<br/>can explain.",
  "No machine learning or AI API in the checker. The narrator in this video is synthetic.",
);
await at(28.5);
await copy(
  "EVIDENCE BEFORE FORWARDS",
  "Always ask a doctor.",
  `Try the app: ${publicUrl}`,
  true,
);
await at(32.4);
const video = page.video();
await context.close();
const videoPath = await video.path();
await fs.writeFile(
  path.join(root, "media", "capture.json"),
  JSON.stringify(
    {
      rawVideo: videoPath,
      duration: 32.4,
      capturedAt: new Date().toISOString(),
      actualApp: base,
      syntheticNarration: true,
    },
    null,
    2,
  ),
);
await browser.close();
console.log("Captured real app footage:", videoPath);
