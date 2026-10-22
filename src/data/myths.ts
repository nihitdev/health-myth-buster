import { expandedMyths } from "./expanded.ts";
export type Verdict = "TRUE" | "FALSE" | "UNVERIFIED";
export interface Source {
  organization: string;
  title: string;
  url: string;
  evidence: string;
}
export interface Myth {
  id: string;
  claim: string;
  alternates: string[];
  required: string[][];
  negationSensitive: boolean;
  verdict: Exclude<Verdict, "UNVERIFIED">;
  explanation: string;
  sources: Source[];
  reviewStatus: "evidence-reviewed";
  lastReviewed: string;
  category: string;
  reviewedVariants?: {
    claim: string;
    alternates: string[];
    verdict: Exclude<Verdict, "UNVERIFIED">;
  }[];
}
const cdcAnt: Source = {
  organization: "CDC",
  title: "Healthy Habits: Antibiotic Do’s and Don’ts",
  url: "https://www.cdc.gov/antibiotic-use/about/index.html",
  evidence:
    "Sections on viruses, prescribing, sharing medicines and side effects.",
};
const nhsAnt: Source = {
  organization: "NHS",
  title: "Overview — Antibiotics",
  url: "https://www.nhs.uk/medicines/antibiotics/",
  evidence:
    "Overview, how to take antibiotics, side effects and considerations.",
};
const whoD: Source = {
  organization: "WHO",
  title: "Dengue",
  url: "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue",
  evidence:
    "Key facts, transmission, risk factors, and prevention and control.",
};
const cdcD: Source = {
  organization: "CDC",
  title: "About Dengue",
  url: "https://www.cdc.gov/dengue/about/index.html",
  evidence: "Key points, what it is, how it spreads, prevention and treatment.",
};
const whoP: Source = {
  organization: "WHO",
  title: "Physical activity",
  url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  evidence: "Benefits of physical activity and risks of sedentary behaviour.",
};
const cdcP: Source = {
  organization: "CDC",
  title: "Benefits of Physical Activity",
  url: "https://www.cdc.gov/physical-activity-basics/benefits/index.html",
  evidence:
    "Immediate benefits, cardiovascular disease and type 2 diabetes sections.",
};
function entry(
  id: string,
  claim: string,
  alternates: string[],
  required: string[][],
  verdict: Myth["verdict"],
  explanation: string,
  category: string,
  sources: Source[],
): Myth {
  return {
    id,
    claim,
    alternates,
    required,
    verdict,
    explanation,
    category,
    sources,
    negationSensitive: true,
    reviewStatus: "evidence-reviewed",
    lastReviewed: "2026-10-22",
  };
}
export const myths: Myth[] = [
  entry(
    "ant-cold",
    "Antibiotics cure the common cold.",
    ["Antibiotics treat colds", "Antibiotics can cure a cold"],
    [["antibiotics"], ["cure", "treat"], ["cold", "colds"]],
    "FALSE",
    "Colds are caused by viruses. Antibiotics act against bacteria, so they do not cure a cold.",
    "Medicines",
    [cdcAnt, nhsAnt],
  ),
  entry(
    "ant-flu",
    "Antibiotics cure the flu.",
    ["Antibiotics treat influenza"],
    [["antibiotics"], ["cure", "treat"], ["flu", "influenza"]],
    "FALSE",
    "Flu is a viral infection. Antibiotics do not treat the flu virus.",
    "Medicines",
    [cdcAnt, nhsAnt],
  ),
  entry(
    "ant-virus",
    "Antibiotics treat viral infections.",
    ["Antibiotics kill viruses"],
    [["antibiotics"], ["treat", "kill", "cure"], ["viral", "viruses"]],
    "FALSE",
    "Antibiotics target bacteria rather than viruses. A clinician can assess which care is appropriate.",
    "Medicines",
    [cdcAnt, nhsAnt],
  ),
  entry(
    "ant-share",
    "It is safe to share antibiotics.",
    ["Sharing antibiotics is safe", "I can safely borrow antibiotics"],
    [["antibiotics"], ["share", "sharing", "borrow"], ["safe", "safely"]],
    "FALSE",
    "Antibiotics prescribed for another person may be inappropriate and can cause harm.",
    "Medicines",
    [cdcAnt, nhsAnt],
  ),
  entry(
    "ant-effects",
    "Antibiotics can cause side effects.",
    ["Antibiotics may have side effects"],
    [["antibiotics"], ["cause", "have"], ["side effects"]],
    "TRUE",
    "Antibiotics can have unwanted effects, including nausea, diarrhoea or allergic reactions.",
    "Medicines",
    [cdcAnt, nhsAnt],
  ),
  entry(
    "dengue-mosquito",
    "Dengue spreads through infected mosquito bites.",
    ["Mosquito bites can spread dengue", "Infected mosquitoes transmit dengue"],
    [
      ["dengue"],
      ["mosquito", "mosquitoes"],
      ["spreads", "spread", "transmit", "transmitted"],
    ],
    "TRUE",
    "Infected Aedes mosquitoes are the main route by which dengue spreads to people.",
    "Infections",
    [whoD, cdcD],
  ),
  entry(
    "dengue-repeat",
    "You can get dengue more than once.",
    ["Dengue can happen again", "You can catch dengue twice"],
    [["dengue"], ["more than once", "again", "twice"]],
    "TRUE",
    "Dengue has several virus types. A previous infection does not prevent all future dengue infections.",
    "Infections",
    [whoD, cdcD],
  ),
  entry(
    "dengue-virus",
    "Dengue is a viral infection.",
    ["Dengue is caused by a virus"],
    [["dengue"], ["viral", "virus"], ["is", "caused"]],
    "TRUE",
    "Dengue is caused by dengue viruses.",
    "Infections",
    [whoD, cdcD],
  ),
  entry(
    "dengue-prevent",
    "Avoiding mosquito bites helps prevent dengue.",
    ["Preventing mosquito bites reduces dengue risk"],
    [
      ["dengue"],
      ["mosquito"],
      ["avoiding", "preventing"],
      ["prevent", "reduces"],
    ],
    "TRUE",
    "Reducing exposure to mosquito bites helps lower the risk of dengue.",
    "Infections",
    [whoD, cdcD],
  ),
  entry(
    "activity-heart",
    "Regular physical activity reduces the risk of heart disease.",
    ["Exercise lowers heart disease risk"],
    [
      ["physical activity", "exercise"],
      ["reduces", "lowers"],
      ["heart disease"],
      ["risk"],
    ],
    "TRUE",
    "Regular activity can lower cardiovascular risk. It does not guarantee protection from disease.",
    "Everyday health",
    [whoP, cdcP],
  ),
  entry(
    "activity-mind",
    "Regular physical activity can improve mental health.",
    ["Exercise helps mental health"],
    [
      ["physical activity", "exercise"],
      ["improve", "helps"],
      ["mental health"],
    ],
    "TRUE",
    "Regular activity can support mental well-being and reduce symptoms of anxiety and depression.",
    "Everyday health",
    [whoP, cdcP],
  ),
  entry(
    "activity-diabetes",
    "Physical activity reduces the risk of type 2 diabetes.",
    ["Exercise lowers type 2 diabetes risk"],
    [
      ["physical activity", "exercise"],
      ["reduces", "lowers"],
      ["type 2 diabetes"],
      ["risk"],
    ],
    "TRUE",
    "Regular physical activity can lower the risk of developing type 2 diabetes.",
    "Everyday health",
    [whoP, cdcP],
  ),
  ...expandedMyths,
];

// These opposite-polarity statements were explicitly checked against each entry's sources.
const variants: Record<string, NonNullable<Myth["reviewedVariants"]>> = {
  "ant-cold": [
    {
      claim: "Antibiotics do not cure the common cold.",
      alternates: [
        "Antibiotics don't cure colds",
        "Antibiotics cannot treat a cold",
      ],
      verdict: "TRUE",
    },
  ],
  "ant-flu": [
    {
      claim: "Antibiotics do not treat influenza.",
      alternates: ["Antibiotics don't work for the flu"],
      verdict: "TRUE",
    },
  ],
  "ant-virus": [
    {
      claim: "Antibiotics do not treat viral infections.",
      alternates: [
        "Antibiotics don't kill viruses",
        "Antibiotics cannot treat viruses",
      ],
      verdict: "TRUE",
    },
  ],
  "hiv-hug": [
    {
      claim: "HIV does not spread through hugging.",
      alternates: ["You cannot catch HIV from a hug"],
      verdict: "TRUE",
    },
  ],
  "hiv-mosquito": [
    {
      claim: "Mosquitoes do not transmit HIV.",
      alternates: ["HIV does not spread through mosquito bites"],
      verdict: "TRUE",
    },
  ],
  "vaccine-autism": [
    {
      claim: "Vaccines do not cause autism.",
      alternates: [
        "Vaccines don't cause autism",
        "The MMR vaccine does not cause autism",
      ],
      verdict: "TRUE",
    },
  ],
  "smokeless-safe": [
    {
      claim: "Smokeless tobacco is not harmless.",
      alternates: ["Chewing tobacco is not safe"],
      verdict: "TRUE",
    },
  ],
};
for (const myth of myths) myth.reviewedVariants = variants[myth.id];
