export type Ingredient = {
  key: string;
  label: string;
  gramsPerLoaf: number;
  note?: string;
};

export type Stage = {
  key: string;
  title: string;
  detail: string;
  minMinutes: number;
  recommendedMinutes: number;
  maxMinutes: number;
  type?: "active" | "rest" | "bake" | "cold";
};

export type BakeMode = "sequential" | "together";

export const doughWeightPerLoaf = 900;
export const bakedWeightEstimatePerLoaf = {
  min: 760,
  max: 770,
};

export const ingredients: Ingredient[] = [
  { key: "breadFlour", label: "קמח לחם", gramsPerLoaf: 400 },
  { key: "speltFlour", label: "קמח כוסמין מלא", gramsPerLoaf: 60 },
  { key: "autolyseWater", label: "מים לאוטוליזה", gramsPerLoaf: 300 },
  { key: "lateWater", label: "מים להוספה בהמשך", gramsPerLoaf: 15 },
  {
    key: "starter",
    label: "מחמצת פעילה בשיא (100% הידרציה)",
    gramsPerLoaf: 115,
  },
  { key: "salt", label: "מלח", gramsPerLoaf: 10 },
];

export const defaultLoafCount = 1;
export const defaultStartTime = "18:00";

export const baseStages: Stage[] = [
  {
    key: "autolyse",
    title: "אוטוליזה",
    detail: "מערבבים את הקמחים עם 300 גרם מים עד שאין קמח יבש, מכסים ונותנים מנוחה.",
    minMinutes: 35,
    recommendedMinutes: 40,
    maxMinutes: 45,
    type: "rest",
  },
  {
    key: "mix",
    title: "הוספת מחמצת, מלח ומים אחרונים",
    detail: "מטמיעים מחמצת, מוסיפים מלח ואז את 15 גרם המים בהדרגה עד שהבצק אחיד ורך.",
    minMinutes: 5,
    recommendedMinutes: 6,
    maxMinutes: 7,
    type: "active",
  },
  {
    key: "fold1",
    title: "קיפול 1",
    detail: "אחרי 30 דקות של bulk — 4 משיכות וקיפול מכל צד או coil folds.",
    minMinutes: 0,
    recommendedMinutes: 0,
    maxMinutes: 0,
    type: "active",
  },
  {
    key: "fold2",
    title: "קיפול 2",
    detail: "עוד 30 דקות אחרי הקיפול הראשון.",
    minMinutes: 30,
    recommendedMinutes: 30,
    maxMinutes: 30,
    type: "rest",
  },
  {
    key: "fold3",
    title: "קיפול 3",
    detail: "עוד 30 דקות אחרי הקיפול השני.",
    minMinutes: 30,
    recommendedMinutes: 30,
    maxMinutes: 30,
    type: "rest",
  },
  {
    key: "fold4-check",
    title: "בדיקת קיפול רביעי",
    detail: "אחרי 120 דקות מתחילת ה-bulk: לבצע רק אם הבצק עדיין רפוי וחסר גוף.",
    minMinutes: 30,
    recommendedMinutes: 30,
    maxMinutes: 30,
    type: "rest",
  },
  {
    key: "bulk-finish",
    title: "סיום bulk",
    detail: "הבצק מוכן בדרך כלל בין 3:30 ל-4:15 מתחילת ה-bulk. עוצרים סביב עלייה של 40%–50% ולא מחכים להכפלה מלאה.",
    minMinutes: 90,
    recommendedMinutes: 135,
    maxMinutes: 180,
    type: "rest",
  },
  {
    key: "preshape",
    title: "עיצוב ראשוני ומנוחה",
    detail: "מעצבים בעדינות לכדור או אובל ונותנים מנוחה.",
    minMinutes: 20,
    recommendedMinutes: 23,
    maxMinutes: 25,
    type: "active",
  },
  {
    key: "final-shape",
    title: "עיצוב סופי",
    detail: "מעצבים לכיכר מתוחה ומעבירים לסלסילה מקומחת היטב, תפר כלפי מעלה.",
    minMinutes: 2,
    recommendedMinutes: 3,
    maxMinutes: 4,
    type: "active",
  },
  {
    key: "cold-proof",
    title: "התפחה קרה",
    detail: "מכסים ומכניסים למקרר בטמפרטורה רצויה של 3–5 מעלות, יעד מועדף 4 מעלות.",
    minMinutes: 10 * 60,
    recommendedMinutes: 12 * 60,
    maxMinutes: 14 * 60,
    type: "cold",
  },
  {
    key: "preheat",
    title: "חימום תנור וסיר",
    detail: "מחממים תנור עם הסיר בפנים ל-250° במשך 50–60 דקות. לא מקצרים את השלב הזה.",
    minMinutes: 50,
    recommendedMinutes: 55,
    maxMinutes: 60,
    type: "bake",
  },
  {
    key: "score",
    title: "חריצה והעברה לאפייה",
    detail: "מוציאים מהמקרר, הופכים על נייר אפייה ונותנים חתך אחד ארוך, נקי, בזווית קלה.",
    minMinutes: 3,
    recommendedMinutes: 5,
    maxMinutes: 7,
    type: "active",
  },
];

export const bakeDurations = {
  covered: { min: 20, recommended: 20, max: 20 },
  uncovered: { min: 23, recommended: 24, max: 25 },
  cooling: { min: 90, recommended: 120, max: 120 },
};

export const recipeNotes = [
  "המחמצת צריכה להיות בשיא — תפוחה, מלאה בועות, עם ריח טוב, ולא אחרי נפילה.",
  "יעד טמפרטורת הבצק בסוף הערבוב: 24 עד 25 מעלות.",
  "לא מורידים מלח, לא מחכים להכפלה מלאה ב-bulk, ולא אופים עם מחמצת עייפה.",
  "לא חותכים את הלחם חם — מחכים לפחות שעה וחצי, ועדיף שעתיים.",
  "מומלץ לעבוד עם הגרסה הזאת כמו שהיא במשך 3 עד 4 אפיות רצופות לפני שמשנים משהו.",
];

export function scaleIngredients(loafCount: number) {
  return ingredients.map((ingredient) => ({
    ...ingredient,
    totalGrams: ingredient.gramsPerLoaf * loafCount,
  }));
}
