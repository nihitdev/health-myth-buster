import ts from "typescript";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
const baselineRef = "e8de578";
const root = process.cwd();
const out = path.join(root, "deliverables/ppt-update");
await fs.mkdir(out, { recursive: true });
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "hmb-benchmark-"));
async function version(name, ref, files) {
  const folder = path.join(temp, name);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, "package.json"), '{"type":"module"}');
  for (const file of files) {
    const source = ref
      ? execFileSync("git", ["show", `${ref}:${file}`], { encoding: "utf8" })
      : await fs.readFile(path.join(root, file), "utf8");
    let code = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    }).outputText;
    code = code.replace(
      /from\s+(['"])(\.[^'"]+)\1/g,
      (_, quote, relative) =>
        `from ${quote}${relative.replace(/\.ts$/, "")}.js${quote}`,
    );
    const target = path.join(
      folder,
      file.replace(/^src\//, "").replace(/\.ts$/, ".js"),
    );
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, code);
  }
  return import(pathToFileURL(path.join(folder, "engine.js")).href);
}
const before = await version("before", baselineRef, [
  "src/engine.ts",
  "src/data/myths.ts",
]);
const after = await version("after", null, [
  "src/engine.ts",
  "src/language.ts",
  "src/data/myths.ts",
  "src/data/expanded.ts",
]);
const cases = [
  ["Antibiotics cure the common cold.", "FALSE"],
  ["Antibotics treat colds", "FALSE"],
  ["Antibiotics treat influenza", "FALSE"],
  ["Antibiotics kill viruses", "FALSE"],
  ["Antibiotics can cause side effects.", "TRUE"],
  ["Dengue is a viral infection.", "TRUE"],
  ["You can catch dengue twice", "TRUE"],
  ["Exercise helps mental health", "TRUE"],
  ["Blue notebooks prevent headaches.", "UNVERIFIED"],
  ["Drinking water is important", "UNVERIFIED"],
  ["Antibiotics cure common illness", "UNVERIFIED"],
  ["Antibiotics cure colds and prevent cancer", "UNVERIFIED"],
  ["Do antibiotics work for the flu?", "FALSE"],
  ["Vaccines cause autism.", "FALSE"],
  ["Vaccines do not cause autism.", "TRUE"],
  ["Can mosquitoes spread HIV?", "FALSE"],
  ["Smoking causes lung cancer", "TRUE"],
  ["Gutkha is harmless", "FALSE"],
  ["Boiling water removes toxic chemicals.", "FALSE"],
  ["Antibiotics do not cure the common cold.", "TRUE"],
];
const results = cases.map(([claim, expected], i) => {
  const b = before.checkClaim(claim);
  const a = after.checkClaim(claim);
  return {
    id: i + 1,
    claim,
    expected,
    before: b.verdict,
    after: a.verdict,
    beforeMatched: b.verdict === expected,
    afterMatched: a.verdict === expected,
    sources: a.myth?.sources.map((s) => s.url) || [],
  };
});
const b = results.filter((r) => r.beforeMatched).length,
  a = results.filter((r) => r.afterMatched).length;
const report = {
  type: "Curated automated engineering benchmark, NOT a participant study",
  date: new Date().toISOString(),
  baselineCommit: baselineRef,
  currentCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  total: cases.length,
  beforeCorrect: b,
  afterCorrect: a,
  beforePercent: (b / cases.length) * 100,
  afterPercent: (a / cases.length) * 100,
  scopeNote:
    "The versions differ in evidence coverage and wording support. Earlier UNVERIFIED responses for missing coverage were appropriate abstentions; these pass counts are not clinical accuracy or five-person user-testing results.",
  results,
};
await fs.writeFile(
  path.join(out, "Automated_Benchmark.json"),
  JSON.stringify(report, null, 2),
);
const csvCell = (v) => '"' + String(v).replaceAll('"', '""') + '"';
await fs.writeFile(
  path.join(out, "Automated_Benchmark.csv"),
  [
    "Claim,Expected,Before,After,Before matched expected,After matched expected",
    ...results.map((r) =>
      [r.claim, r.expected, r.before, r.after, r.beforeMatched, r.afterMatched]
        .map(csvCell)
        .join(","),
    ),
  ].join("\r\n"),
);
if (a !== cases.length)
  throw new Error(
    `Current version failed ${cases.length - a} benchmark cases; inspect report.`,
  );
console.log(
  JSON.stringify(
    {
      total: report.total,
      beforeCorrect: b,
      afterCorrect: a,
      beforePercent: report.beforePercent,
      afterPercent: report.afterPercent,
      type: report.type,
    },
    null,
    2,
  ),
);
