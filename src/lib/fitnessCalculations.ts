export interface CooperTableEntry {
  ageGroup: string;
  minAge: number;
  maxAge: number;
  muitoBaixo: string; // "< 33"
  baixo: string;      // "33–36"
  regular: string;    // "37–41"
  bom: string;        // "42–46"
  excelente: string;  // "≥ 47"
  // numeric thresholds: [baixoMin, regularMin, bomMin, excelenteMin]
  thresholds: [number, number, number, number];
}

export const MEN_COOPER_TABLE: CooperTableEntry[] = [
  { ageGroup: "20–29", minAge: 20, maxAge: 29, muitoBaixo: "< 33", baixo: "33–36", regular: "37–41", bom: "42–46", excelente: "≥ 47", thresholds: [33, 37, 42, 47] },
  { ageGroup: "30–39", minAge: 30, maxAge: 39, muitoBaixo: "< 31", baixo: "31–34", regular: "35–39", bom: "40–44", excelente: "≥ 45", thresholds: [31, 35, 40, 45] },
  { ageGroup: "40–49", minAge: 40, maxAge: 49, muitoBaixo: "< 29", baixo: "29–32", regular: "33–36", bom: "37–41", excelente: "≥ 42", thresholds: [29, 33, 37, 42] },
  { ageGroup: "50–59", minAge: 50, maxAge: 59, muitoBaixo: "< 26", baixo: "26–29", regular: "30–33", bom: "34–38", excelente: "≥ 39", thresholds: [26, 30, 34, 39] },
  { ageGroup: "60–69", minAge: 60, maxAge: 69, muitoBaixo: "< 23", baixo: "23–26", regular: "27–30", bom: "31–35", excelente: "≥ 36", thresholds: [23, 27, 31, 36] },
  { ageGroup: "70–79", minAge: 70, maxAge: 79, muitoBaixo: "< 20", baixo: "20–23", regular: "24–26", bom: "27–30", excelente: "≥ 31", thresholds: [20, 24, 27, 31] },
];

export const WOMEN_COOPER_TABLE: CooperTableEntry[] = [
  { ageGroup: "20–29", minAge: 20, maxAge: 29, muitoBaixo: "< 27", baixo: "27–30", regular: "31–35", bom: "36–40", excelente: "≥ 41", thresholds: [27, 31, 36, 41] },
  { ageGroup: "30–39", minAge: 30, maxAge: 39, muitoBaixo: "< 25", baixo: "25–28", regular: "29–33", bom: "34–38", excelente: "≥ 39", thresholds: [25, 29, 34, 39] },
  { ageGroup: "40–49", minAge: 40, maxAge: 49, muitoBaixo: "< 23", baixo: "23–26", regular: "27–30", bom: "31–35", excelente: "≥ 36", thresholds: [23, 27, 31, 36] },
  { ageGroup: "50–59", minAge: 50, maxAge: 59, muitoBaixo: "< 21", baixo: "21–24", regular: "25–28", bom: "29–33", excelente: "≥ 34", thresholds: [21, 25, 29, 34] },
  { ageGroup: "60–69", minAge: 60, maxAge: 69, muitoBaixo: "< 18", baixo: "18–21", regular: "22–25", bom: "26–29", excelente: "≥ 30", thresholds: [18, 22, 26, 30] },
  { ageGroup: "70–79", minAge: 70, maxAge: 79, muitoBaixo: "< 16", baixo: "16–19", regular: "20–23", bom: "24–27", excelente: "≥ 28", thresholds: [16, 20, 24, 28] },
];

export function calculateCooperVo2Max(distanceMeters: number): number {
  if (!distanceMeters || distanceMeters <= 0) return 0;
  const vo2 = (distanceMeters - 504.9) / 44.73;
  return Math.max(0, parseFloat(vo2.toFixed(2)));
}

export type CooperClassification = "Muito baixo" | "Baixo" | "Regular" | "Bom" | "Excelente";

export function classifyCooper(vo2Max: number, age: number, gender: "Masculino" | "Feminino" | string): {
  classification: CooperClassification;
  matchedRow: CooperTableEntry;
  matchedColIndex: number; // 0: Muito baixo, 1: Baixo, 2: Regular, 3: Bom, 4: Excelente
} {
  const isFemale = (gender || "").toLowerCase().startsWith("f");
  const table = isFemale ? WOMEN_COOPER_TABLE : MEN_COOPER_TABLE;

  // Find corresponding row by age
  let matchedRow = table.find(r => age >= r.minAge && age <= r.maxAge);
  if (!matchedRow) {
    if (age < 20) matchedRow = table[0];
    else matchedRow = table[table.length - 1];
  }

  const [baixoMin, regularMin, bomMin, excelenteMin] = matchedRow.thresholds;

  let classification: CooperClassification = "Muito baixo";
  let matchedColIndex = 0;

  if (vo2Max >= excelenteMin) {
    classification = "Excelente";
    matchedColIndex = 4;
  } else if (vo2Max >= bomMin) {
    classification = "Bom";
    matchedColIndex = 3;
  } else if (vo2Max >= regularMin) {
    classification = "Regular";
    matchedColIndex = 2;
  } else if (vo2Max >= baixoMin) {
    classification = "Baixo";
    matchedColIndex = 1;
  } else {
    classification = "Muito baixo";
    matchedColIndex = 0;
  }

  return { classification, matchedRow, matchedColIndex };
}

export type TrainingGoal = "hipertrofia" | "forca" | "resistencia" | "potencia";

export interface GoalDetails {
  id: TrainingGoal;
  label: string;
  minPercent: number;
  maxPercent: number;
  repsRange: string;
  restRange: string;
  description: string;
}

export const TRAINING_GOALS: Record<TrainingGoal, GoalDetails> = {
  hipertrofia: {
    id: "hipertrofia",
    label: "Hipertrofia Muscular",
    minPercent: 67,
    maxPercent: 85,
    repsRange: "6 a 12 repetições",
    restRange: "60 a 90 segundos",
    description: "Faixa ideal para ganho de massa muscular com intensidade moderada-alta e tensão mecânica prolongada.",
  },
  forca: {
    id: "forca",
    label: "Força Máxima",
    minPercent: 85,
    maxPercent: 100,
    repsRange: "1 a 5 repetições",
    restRange: "2 a 5 minutos",
    description: "Foco em adaptações neurais e recrutamento máximo de unidades motoras.",
  },
  resistencia: {
    id: "resistencia",
    label: "Resistência Muscular",
    minPercent: 50,
    maxPercent: 67,
    repsRange: "15 a 25+ repetições",
    restRange: "30 a 60 segundos",
    description: "Aprimoramento da capacidade oxidativa, resistência à fadiga e densidade capilar.",
  },
  potencia: {
    id: "potencia",
    label: "Potência / Explosão",
    minPercent: 75,
    maxPercent: 90,
    repsRange: "3 a 5 repetições explosivas",
    restRange: "2 a 3 minutos",
    description: "Desenvolvimento de taxa de produção de força (RFD) com alta velocidade de execução.",
  }
};

export function getGoalRecommendation(goal: TrainingGoal, base1RM: number) {
  const details = TRAINING_GOALS[goal] || TRAINING_GOALS.hipertrofia;
  const minWeight = base1RM > 0 ? parseFloat(((base1RM * details.minPercent) / 100).toFixed(1)) : 0;
  const maxWeight = base1RM > 0 ? parseFloat(((base1RM * details.maxPercent) / 100).toFixed(1)) : 0;
  return {
    ...details,
    minWeight,
    maxWeight,
  };
}

export function calculate1RM(weight: number, reps: number): {
  epley: number;
  brzycki: number;
  intensityZones: { percent: number; weight: number }[];
} {
  if (!weight || weight <= 0 || !reps || reps <= 0) {
    return { epley: 0, brzycki: 0, intensityZones: [] };
  }

  // Epley: 1RM = Weight * (1 + Reps / 30)
  const epley = parseFloat((weight * (1 + reps / 30)).toFixed(1));

  // Brzycki: 1RM = Weight / (1.0278 - 0.0278 * Reps)
  const brzyckiFactor = 1.0278 - 0.0278 * reps;
  const brzycki = brzyckiFactor > 0 ? parseFloat((weight / brzyckiFactor).toFixed(1)) : epley;

  const base1RM = epley; // Standard reference
  const intensityZones = [100, 95, 90, 85, 80, 75, 70, 65, 60, 50].map(pct => ({
    percent: pct,
    weight: parseFloat(((base1RM * pct) / 100).toFixed(1)),
  }));

  return { epley, brzycki, intensityZones };
}

