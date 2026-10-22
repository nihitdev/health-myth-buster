import type { Verdict } from "./data/myths";
export interface TestRecord {
  id: string;
  claim: string;
  actual: Verdict;
  expected: Verdict;
  correct: boolean;
  feedback: string;
  phase: "before" | "after";
  created: string;
}
export const STORAGE_KEY = "hmb-tests-v1";
export function readRecords(): TestRecord[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    return Array.isArray(value)
      ? value.filter(
          (r): r is TestRecord =>
            !!r &&
            typeof r === "object" &&
            typeof r.id === "string" &&
            typeof r.claim === "string" &&
            typeof r.correct === "boolean" &&
            ["TRUE", "FALSE", "UNVERIFIED"].includes(r.actual) &&
            ["TRUE", "FALSE", "UNVERIFIED"].includes(r.expected) &&
            ["before", "after"].includes(r.phase) &&
            typeof r.feedback === "string" &&
            typeof r.created === "string",
        )
      : [];
  } catch {
    return [];
  }
}
export function summary(records: TestRecord[]) {
  const correct = records.filter((r) => r.correct).length;
  return {
    total: records.length,
    correct,
    incorrect: records.length - correct,
    accuracy: records.length ? (correct / records.length) * 100 : 0,
  };
}
export function csv(records: TestRecord[]): string {
  const keys: (keyof TestRecord)[] = [
    "id",
    "claim",
    "actual",
    "expected",
    "correct",
    "feedback",
    "phase",
    "created",
  ];
  const cell = (v: unknown) => {
    let s = String(v);
    if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  return [
    keys.join(","),
    ...records.map((r) => keys.map((k) => cell(r[k])).join(",")),
  ].join("\r\n");
}
export function download(content: string, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
