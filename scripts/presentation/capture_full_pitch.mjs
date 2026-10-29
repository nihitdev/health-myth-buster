/* global document, window */
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const out = path.resolve("deliverables/full-pitch");
const timeline = JSON.parse(
  await fs.readFile(path.join(out, "timeline.json"), "utf8"),
);
const parts = Object.fromEntries(timeline.parts.map((p) => [p.name, p]));
const base = process.env.HMB_BASE_URL || "http://127.0.0.1:5173";
const publicUrl = "https://health-myth-buster-amber.vercel.app/";
await fs.mkdir(path.join(out, "raw"), { recursive: true });
const browser = await chromium.launch({ headless: true });
const verify = await browser.newPage();
try {
  const response = await verify.goto(publicUrl, {
    waitUntil: "domcontentloaded",
    timeout: 20000,
  });
  console.log("Public website HTTP:", response.status());
} catch (e) {
  console.log("Public URL could not be rechecked:", e.message);
}
await verify.close();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: {
    dir: path.join(out, "raw"),
    size: { width: 1920, height: 1080 },
  },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const markup = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Health Myth Buster — team presentation</title><style>
*{box-sizing:border-box}body{margin:0;width:1920px;height:1080px;overflow:hidden;font-family:Arial,sans-serif;background:#102a34;color:#edf7f3}.glow{position:absolute;right:-300px;top:-450px;width:1300px;height:1300px;border-radius:50%;background:radial-gradient(circle,#14685770,transparent 65%)}header{position:absolute;left:76px;right:76px;top:44px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:16px;font-size:28px;font-weight:700}.brand img{width:50px;height:50px}.tag{border:1px solid #42686d;border-radius:30px;padding:14px 23px;font-size:19px;color:#b8d8cf}.content{position:absolute;left:76px;right:76px;top:160px;bottom:125px;display:grid;grid-template-columns:490px 1fr;gap:58px;align-items:center}.eyebrow{font-size:20px;letter-spacing:2px;color:#86ddc6;font-weight:700}h1{font-size:65px;line-height:1.1;letter-spacing:-2.3px;margin:25px 0;color:#fff}.description{font-size:27px;line-height:1.5;color:#c1d3d4;margin:0 0 26px}.speaker-label{font-size:17px;color:#a7c4c3;text-transform:uppercase;letter-spacing:1.5px;margin-top:40px}.speakers{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.speakers span{font-size:21px;border:1px solid #42616a;padding:11px 17px;border-radius:10px;color:#a9c1c1}.speakers .active{color:#102a34;background:#8bdcc7;border-color:#8bdcc7;font-weight:700}.window{height:738px;background:#fff;border:1px solid #507276;border-radius:20px;overflow:hidden;box-shadow:0 25px 75px #0005}.bar{height:42px;background:#eaf1ed;display:flex;gap:8px;align-items:center;padding:0 18px;color:#526970;font-size:15px}.bar i{height:9px;width:9px;border-radius:50%;background:#a6bcb4}.bar span{margin-left:10px}iframe{border:0;width:100%;height:696px;background:white}.closing .content{grid-template-columns:1fr;text-align:center;max-width:1550px;margin:auto}.closing .window{display:none}.closing h1{font-size:90px;letter-spacing:-3px}.closing .description{max-width:1380px;margin:0 auto 22px}.closing .speakers{justify-content:center}.closing .speaker-label{margin-top:30px}.credit{font-size:23px;color:#abc6c3;margin-top:25px}.credit strong{color:#8bdcc7}.footer{position:absolute;left:76px;right:76px;bottom:34px;display:flex;justify-content:space-between;color:#a2bfbc;font-size:17px}.footer strong{color:#d3e9e0}.metrics{display:none;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}.metric{border:1px solid #47666a;border-radius:15px;padding:20px;background:#183b40}.metric strong{font-size:54px;display:block;color:#8bdcc7}.metric span{font-size:20px;color:#d0e4dd}.metrics-note{font-size:22px;color:#bfd0d0;grid-column:1/-1;margin-top:0}.metrics-on .metrics{display:grid}.metrics-on .credit{display:none}.metrics-on h1{font-size:70px}.metrics-on .description{font-size:26px}.progress{position:absolute;left:0;bottom:0;height:5px;background:#86ddc6;width:0}
</style></head><body class="closing"><div class="glow"></div><header><div class="brand"><img src="${base}/favicon.svg" alt=""/>healthmyth BUSTER</div><div class="tag">team_1127_0032 · HCL Jigsaw 7.0 · Grade 6</div></header><main class="content"><section><div class="eyebrow" id="eyebrow">AI REVOLUTION & DIGITAL FUTURES</div><h1 id="title">Health Myth Buster</h1><p class="description" id="description">Birla Open Minds International School · Indore, India</p><div class="metrics" id="metrics"><div class="metric"><strong>247</strong><span>unit tests</span></div><div class="metric"><strong>8</strong><span>browser tests</span></div><p class="metrics-note">Recorded engineering checks. Not a medical accuracy score.</p></div><div class="credit" id="credit">Built and developed by <strong>Nihit</strong></div><div class="speaker-label">Team voices</div><div class="speakers"><span data-name="Nihit">Nihit</span><span data-name="Rudransh">Rudransh</span><span data-name="Priyushi">Priyushi</span><span data-name="Ahika">Ahika</span></div></section><section class="window"><div class="bar"><i></i><i></i><i></i><span>Actual app · live keyword matching · original team recordings</span></div><iframe src="${base}" title="Working Health Myth Buster app"></iframe></section></main><div class="footer"><span id="footer-note">A four-part team presentation</span><strong>Always ask a doctor.</strong></div><div class="progress"></div></body></html>`;
await page.setContent(markup, { waitUntil: "networkidle" });
const frame = page.frames().find((f) => f.url().startsWith(base));
if (!frame) throw new Error("App frame did not load");
const compact = `header,footer,.hero-copy,.checker-coverage,.hero~*{display:none!important}main{max-width:100%;padding:0 26px}.hero{display:block;padding:20px 0}.checker{max-width:1010px;border:0;border-radius:0;box-shadow:none;margin:auto;padding:24px}.checker-heading h2{font-size:30px}.checker-heading p{font-size:21px}.checker-heading{padding-bottom:18px}.checker textarea{font-size:24px;min-height:125px}.input-meta{font-size:18px}.checker label{font-size:21px}.check-button{font-size:23px;min-height:58px}.claim-examples{margin-top:24px}.examples-title{font-size:23px}.examples-help{font-size:20px}.example-claim,.example-topic{font-size:20px}.result{animation:none;padding:25px;margin:15px 0}.result h3{font-size:28px}.result p{font-size:24px;line-height:1.5}.result .eyebrow,.badge{font-size:18px}.sources strong{font-size:22px}.sources small{font-size:18px}.sources a{padding:12px}.result small{font-size:17px}.result .doctor{font-size:22px}details{font-size:20px}.result-top{margin-bottom:17px}.page{padding:25px 0}.page h1{font-size:46px;margin:10px 0 20px}.lead{font-size:23px;max-width:100%}.filters{gap:14px;flex-wrap:wrap}.filters select,.filters input{font-size:20px}.library-grid{grid-template-columns:1fr 1fr}.library-grid .result p{font-size:20px}.library-grid .result h3{font-size:23px}.library-grid .sources small{font-size:16px}.prose p,.prose li{font-size:24px;line-height:1.6}.prose h2{font-size:32px}.panel h2{font-size:30px}.panel p{font-size:23px}.privacy,.muted{font-size:21px}.stats{gap:16px}.stats strong{font-size:46px}.stats span{font-size:20px}.stats>div{padding:18px}.lab-grid{grid-template-columns:1fr}.lab-grid>div:last-child{display:none}.claim-examples .text-button{font-size:20px}.comparison{font-size:20px}.filters .search-box{min-width:100%}`;
const style = async () => frame.addStyleTag({ content: compact });
await style();
async function navigate(route) {
  await frame.goto(base + route, { waitUntil: "domcontentloaded" });
  await style();
  await frame.evaluate(() => window.scrollTo(0, 0));
}
async function scene({
  speaker,
  title,
  description,
  kicker = "EVIDENCE BEFORE FORWARDS",
  cover = false,
  metrics = false,
  credit = false,
  note = "Actual app demonstration · no participant results invented",
}) {
  await page.evaluate(
    ({ speaker, title, description, kicker, cover, metrics, credit, note }) => {
      document.getElementById("eyebrow").textContent = kicker;
      document.getElementById("title").innerHTML = title;
      document.getElementById("description").textContent = description;
      document.body.classList.toggle("closing", cover);
      document.body.classList.toggle("metrics-on", metrics);
      document.getElementById("credit").style.display = credit
        ? "block"
        : "none";
      document
        .querySelectorAll(".speakers span")
        .forEach((n) =>
          n.classList.toggle("active", n.dataset.name === speaker),
        );
      document.getElementById("footer-note").textContent = note;
    },
    { speaker, title, description, kicker, cover, metrics, credit, note },
  );
}
const events = [];
const schedule = (time, label, action) => events.push({ time, label, action });
const N = parts.Nihit.start,
  R = parts.Rudransh.start,
  P = parts.Priyushi.start,
  A = parts.Ahika.start;
schedule(0, "Opening title", () =>
  scene({
    speaker: "",
    title: "Health Myth Buster",
    description: "Birla Open Minds International School · Indore, India",
    kicker: "team_1127_0032",
    cover: true,
    credit: true,
  }),
);
schedule(N, "Nihit introduces the team", () =>
  scene({
    speaker: "Nihit",
    title: "Health Myth Buster",
    description: "Birla Open Minds International School · Indore, India",
    kicker: "team_1127_0032",
    cover: true,
    credit: true,
  }),
);
schedule(N + 10.3, "The problem", () =>
  scene({
    speaker: "Nihit",
    title: "Before you forward,<br/>check the evidence.",
    description: "A convincing health message still needs a reliable source.",
    cover: true,
    credit: true,
  }),
);
schedule(N + 23.5, "Show the working checker", async () => {
  await navigate("/");
  await scene({
    speaker: "Nihit",
    title: "A simple check.<br/>A clearer answer.",
    description:
      "A free health-literacy prototype for students, families, teachers and NGO volunteers.",
    kicker: "01 · PURPOSE",
  });
});
schedule(R, "Rudransh begins the live demonstration", async () => {
  await navigate("/");
  await scene({
    speaker: "Rudransh",
    title: "Let’s check<br/>a claim.",
    description: "The next result comes from the actual matching engine.",
    kicker: "02 · CLAIM CHECKER",
  });
});
schedule(R + 5.2, "Type the common-cold claim", () =>
  frame
    .getByLabel("Enter a health claim")
    .pressSequentially("Antibiotics cure the common cold.", { delay: 36 }),
);
schedule(R + 12.8, "Run checker and show FALSE", async () => {
  await frame.getByRole("button", { name: "Check Claim", exact: true }).click();
  await frame.getByLabel("Claim result").scrollIntoViewIfNeeded();
  const text = await frame.getByLabel("Claim result").innerText();
  if (!text.includes("FALSE")) throw new Error("Expected actual FALSE verdict");
  await scene({
    speaker: "Rudransh",
    title: "FALSE.<br/>Here’s why.",
    description:
      "Read the explanation and the source links before deciding what to share.",
    kicker: "02 · EVIDENCE-BACKED RESULT",
  });
});
schedule(R + 24.4, "Highlight source links", async () => {
  await frame
    .locator(".sources")
    .first()
    .evaluate((n) => {
      n.style.outline = "3px solid #087b70";
      n.style.outlineOffset = "8px";
    });
  await scene({
    speaker: "Rudransh",
    title: "Go straight<br/>to the sources.",
    description: "The result links to CDC and NHS evidence for this claim.",
    kicker: "02 · READ THE EVIDENCE",
  });
});
schedule(R + 31.2, "Demonstrate a one-click example", async () => {
  await frame
    .getByRole("button", { name: /Vaccines do not cause autism/ })
    .click();
  await frame.getByLabel("Claim result").scrollIntoViewIfNeeded();
  await scene({
    speaker: "Rudransh",
    title: "Or tap<br/>an example.",
    description:
      "A separate reviewed example runs the same checker with one click.",
    kicker: "02 · ONE-CLICK EXAMPLE",
  });
});
schedule(R + 38.3, "Safety reminder", () =>
  scene({
    speaker: "Rudransh",
    title: "For awareness.<br/>Not diagnosis.",
    description:
      "The tool cannot prescribe treatment or replace a medical professional.",
    kicker: "02 · SAFETY FIRST",
  }),
);
schedule(P, "Priyushi begins unknown-claim demonstration", async () => {
  await navigate("/");
  await scene({
    speaker: "Priyushi",
    title: "What if a claim<br/>is unknown?",
    description: "Try something that is outside the reviewed library.",
    kicker: "03 · KNOWING OUR LIMITS",
  });
  await frame
    .getByLabel("Enter a health claim")
    .pressSequentially("Blue notebooks prevent headaches.", { delay: 30 });
});
schedule(P + 4.3, "Show actual UNVERIFIED result", async () => {
  await frame.getByRole("button", { name: "Check Claim", exact: true }).click();
  await frame.getByLabel("Claim result").scrollIntoViewIfNeeded();
  const text = await frame.getByLabel("Claim result").innerText();
  if (!text.includes("UNVERIFIED"))
    throw new Error("Expected actual UNVERIFIED verdict");
  await scene({
    speaker: "Priyushi",
    title: "UNVERIFIED.<br/>No guessing.",
    description: "Unknown does not automatically mean false.",
    kicker: "03 · AN HONEST LIMIT",
  });
});
schedule(P + 15.4, "Show methodology", async () => {
  await navigate("/about");
  await scene({
    speaker: "Priyushi",
    title: "Rules you<br/>can explain.",
    description:
      "Controlled wording patterns and required concepts. No machine learning or AI API.",
    kicker: "03 · TRANSPARENT METHOD",
  });
});
schedule(P + 26.2, "Show reviewed library", async () => {
  await navigate("/library");
  const status = await frame.getByRole("status").innerText();
  if (!status.includes("36 of 36"))
    throw new Error("Reviewed library count changed; review the spoken count");
  await scene({
    speaker: "Priyushi",
    title: "36 reviewed<br/>health claims.",
    description:
      "Every published entry has at least two relevant official references.",
    kicker: "03 · THE EVIDENCE LIBRARY",
  });
});
schedule(P + 34.7, "Show pending-review separation", async () => {
  await frame.locator("details.panel summary").scrollIntoViewIfNeeded();
  await scene({
    speaker: "Priyushi",
    title: "31 candidates.<br/>Still pending.",
    description: "Pending candidates stay separate from verified matching.",
    kicker: "03 · EVIDENCE BEFORE NUMBERS",
  });
});
schedule(A, "Ahika explains engineering checks", () =>
  scene({
    speaker: "Ahika",
    title: "Tested as<br/>software.",
    description:
      "Engineering verification is different from human evaluation and medical validation.",
    kicker: "04 · TESTING & NEXT STEPS",
    cover: true,
    metrics: true,
  }),
);
schedule(A + 11.5, "Show Testing Lab without fabricated records", async () => {
  await navigate("/testing");
  await scene({
    speaker: "Ahika",
    title: "Real evaluation<br/>comes next.",
    description:
      "Record genuine claims and compare before-and-after results. Participant accuracy is not yet measured.",
    kicker: "04 · HONEST TESTING STATUS",
    note: "Isolated demonstration browser · no participant data shown",
  });
});
schedule(A + 21.2, "Show evaluation workflow", async () => {
  await frame
    .getByRole("heading", { name: "Evaluate a claim" })
    .scrollIntoViewIfNeeded();
  await scene({
    speaker: "Ahika",
    title: "Save the tests.<br/>Learn from failures.",
    description:
      "Local records and exports support genuine evaluation without collecting names or contact details.",
    kicker: "04 · THE TESTING LAB",
    note: "Isolated demonstration browser · no participant data shown",
  });
});
schedule(A + 29.1, "Invite schools and NGOs", () =>
  scene({
    speaker: "Ahika",
    title: "Try a claim.<br/>Read the evidence.",
    description: publicUrl,
    kicker: "FOR SCHOOLS, FAMILIES & NGOs",
    cover: true,
    credit: true,
  }),
);
schedule(A + 35.1, "Final safety reminder", () =>
  scene({
    speaker: "Ahika",
    title: "Always ask a doctor.",
    description: publicUrl,
    kicker: "THANK YOU · team_1127_0032",
    cover: true,
    credit: true,
  }),
);
const firstVideoBefore = Date.now();
await page.screenshot({ path: path.join(out, "frames", "stage-layout.png") });
const start = Date.now();
const actualEvents = [];
for (const event of events.sort((a, b) => a.time - b.time)) {
  const wait = event.time * 1000 - (Date.now() - start);
  if (wait > 0) await page.waitForTimeout(wait);
  await event.action();
  const actual = (Date.now() - start) / 1000;
  actualEvents.push({ planned: event.time, actual, label: event.label });
  console.log(`${actual.toFixed(1)}s — ${event.label}`);
  await page.screenshot({
    path: path.join(
      out,
      "frames",
      `scene-${String(actualEvents.length).padStart(2, "0")}.png`,
    ),
  });
}
const remaining = timeline.duration * 1000 - (Date.now() - start);
if (remaining > 0) await page.waitForTimeout(remaining);
const scenarioDuration = (Date.now() - start) / 1000;
const video = page.video();
await context.close();
const raw = await video.path();
await fs.writeFile(
  path.join(out, "capture-full.json"),
  JSON.stringify(
    {
      rawVideo: raw,
      scenarioDuration,
      desiredDuration: timeline.duration,
      events: actualEvents,
      startPaddingSeconds: (start - firstVideoBefore) / 1000,
      app: base,
      website: publicUrl,
      width: 1920,
      height: 1080,
    },
    null,
    2,
  ),
);
await browser.close();
console.log("Full-pitch capture complete:", raw);
