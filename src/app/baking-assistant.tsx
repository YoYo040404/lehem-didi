"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bakedWeightEstimatePerLoaf,
  defaultLoafCount,
  defaultStartTime,
  doughWeightPerLoaf,
  recipeNotes,
  scaleIngredients,
  type BakeMode,
} from "@/lib/recipe";
import { buildBakeSummary, buildTimeline, formatAbsoluteTime, formatDuration } from "@/lib/timeline";

type SavedState = {
  loafCount: number;
  startTime: string;
  bakeMode: BakeMode;
};

const STORAGE_KEY = "bread-planner-state";

function getInitialState(): SavedState {
  if (typeof window === "undefined") {
    return {
      loafCount: defaultLoafCount,
      startTime: defaultStartTime,
      bakeMode: "sequential",
    };
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      loafCount: defaultLoafCount,
      startTime: defaultStartTime,
      bakeMode: "sequential",
    };
  }

  try {
    const parsed = JSON.parse(saved) as Partial<SavedState>;
    return {
      loafCount: typeof parsed.loafCount === "number" ? parsed.loafCount : defaultLoafCount,
      startTime: typeof parsed.startTime === "string" ? parsed.startTime : defaultStartTime,
      bakeMode: parsed.bakeMode === "together" ? "together" : "sequential",
    };
  } catch {
    return {
      loafCount: defaultLoafCount,
      startTime: defaultStartTime,
      bakeMode: "sequential",
    };
  }
}

const steps = [
  "אוטוליזה",
  "הוספת מחמצת, מלח ומים",
  "קיפול 1",
  "קיפול 2",
  "קיפול 3",
  "בדיקת קיפול 4",
  "סיום bulk",
  "עיצוב ראשוני",
  "עיצוב סופי",
  "התפחה קרה",
  "חימום תנור וסיר",
  "חריצה",
  "אפייה",
  "קירור",
];

export default function BakingAssistant() {
  const [initialState] = useState(getInitialState);
  const [loafCount, setLoafCount] = useState(initialState.loafCount);
  const [startTime, setStartTime] = useState(initialState.startTime);
  const [bakeMode, setBakeMode] = useState<BakeMode>(initialState.bakeMode);

  useEffect(() => {
    const payload: SavedState = { loafCount, startTime, bakeMode };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [bakeMode, loafCount, startTime]);

  const ingredients = useMemo(() => scaleIngredients(loafCount), [loafCount]);
  const timeline = useMemo(() => buildTimeline(startTime), [startTime]);
  const bakeSummary = useMemo(() => buildBakeSummary(startTime, loafCount, bakeMode), [bakeMode, loafCount, startTime]);

  const finalWeight = {
    min: bakedWeightEstimatePerLoaf.min * loafCount,
    max: bakedWeightEstimatePerLoaf.max * loafCount,
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1f2937,#111827_45%,#7c2d12_100%)] p-6 text-white shadow-2xl shadow-orange-950/15 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-orange-100 ring-1 ring-white/15">
              לחם מחמצת · עוזר אפייה אישי
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                המתכון המאושר שלך — עכשיו כאפליקציית אפייה נוחה לטלפון
              </h1>
              <p className="max-w-2xl text-base leading-7 text-orange-50/90 sm:text-lg">
                בוחרים מספר כיכרות ושעת התחלה, והאפליקציה מחשבת עבורך כמויות,
                לוח זמנים מלא, ואת השעה שבה הכיכר האחרונה תצא מהתנור.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-[1.5rem] bg-white/10 p-4 backdrop-blur sm:grid-cols-3">
            <SummaryStat label="מספר כיכרות" value={`${loafCount}`} />
            <SummaryStat label="משקל בצק כולל" value={`${doughWeightPerLoaf * loafCount} גרם`} />
            <SummaryStat label="כיכר אחרונה יוצאת" value={formatAbsoluteTime(bakeSummary.ovenOutTime)} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card title="הגדרות האפייה" subtitle="בחר את המשתנים שאתה משנה בין אפייה לאפייה.">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">מספר כיכרות</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={loafCount}
                  onChange={(event) => setLoafCount(Math.max(1, Number(event.target.value) || 1))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">שעת התחלה</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-slate-700">צורת אפייה</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <ModeButton
                  active={bakeMode === "sequential"}
                  title="אפייה ברצף"
                  description="לסיר אחד או מצב שבו כל כיכר נאפית בנפרד."
                  onClick={() => setBakeMode("sequential")}
                />
                <ModeButton
                  active={bakeMode === "together"}
                  title="אפייה יחד"
                  description="כאשר כל הכיכרות נכנסות לאותה אפייה."
                  onClick={() => setBakeMode("together")}
                />
              </div>
            </div>
          </Card>

          <Card title="סיכום זמנים" subtitle="כולל זמן מומלץ וגם חלון זמן מלא, בדיוק כפי שביקשת.">
            <div className="grid gap-4 md:grid-cols-2">
              <HighlightBox label="התחלה" value={startTime} note="תחילת האוטוליזה" />
              <HighlightBox
                label="תחילת האפייה"
                value={formatAbsoluteTime(bakeSummary.bakeStartTime)}
                note={bakeSummary.strategyLabel}
              />
              <HighlightBox
                label="הכיכר האחרונה יוצאת מהתנור"
                value={formatAbsoluteTime(bakeSummary.ovenOutTime)}
                note={`משך אפייה כולל: ${formatDuration(bakeSummary.totalBakeMinutes)}`}
              />
              <HighlightBox
                label="מומלץ לפרוס"
                value={formatAbsoluteTime(bakeSummary.readyToSliceTime)}
                note="מבוסס על שעתיים קירור מלא"
              />
            </div>
          </Card>

          <Card title="כמויות לפי מספר הכיכרות" subtitle="המתכון נשאר קבוע — רק מכפילים אותו בדיוק.">
            <div className="grid gap-3 sm:grid-cols-2">
              {ingredients.map((ingredient) => (
                <div key={ingredient.key} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-600">{ingredient.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{ingredient.totalGrams} גרם</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-orange-50 px-4 py-4 text-orange-950">
                <p className="text-sm font-medium">משקל בצק לפני אפייה</p>
                <p className="mt-1 text-xl font-bold">{doughWeightPerLoaf * loafCount} גרם</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-4 text-emerald-950">
                <p className="text-sm font-medium">משקל משוער אחרי אפייה וקירור מלא</p>
                <p className="mt-1 text-xl font-bold">
                  {finalWeight.min}–{finalWeight.max} גרם
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="לוח הזמנים המלא" subtitle="לכל שלב מוצגים גם זמן מומלץ וגם הטווח המלא מהמתכון.">
            <div className="space-y-4">
              {timeline.stages.map((stage) => (
                <article
                  key={stage.key}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-200/70"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{stage.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{stage.detail}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {stage.windowLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <TimelineTime label="תחילת חלון" value={formatAbsoluteTime(stage.startMin)} />
                    <TimelineTime label="זמן מומלץ" value={formatAbsoluteTime(stage.recommendedEndMin)} />
                    <TimelineTime label="סיום חלון" value={formatAbsoluteTime(stage.maxEndMin)} />
                  </div>
                </article>
              ))}

              <article className="rounded-[1.5rem] border border-orange-200 bg-orange-50 px-4 py-4 shadow-sm shadow-orange-200/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-orange-950">אפייה וקירור</h3>
                    <p className="mt-1 text-sm leading-6 text-orange-900/80">
                      20 דקות עם מכסה ב-250°, ואז עוד 23–25 דקות בלי מכסה ב-230°. אחר כך
                      מחכים לפחות שעה וחצי, ועדיף שעתיים, לפני חיתוך.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-900">
                    אפייה {formatDuration(bakeSummary.singleBakeMinutes)} לכל סבב
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <TimelineTime label="כניסה לתנור" value={formatAbsoluteTime(bakeSummary.bakeStartTime)} />
                  <TimelineTime label="יציאה אחרונה" value={formatAbsoluteTime(bakeSummary.ovenOutTime)} />
                  <TimelineTime label="פריסה מומלצת" value={formatAbsoluteTime(bakeSummary.readyToSliceTime)} />
                </div>
              </article>
            </div>
          </Card>

          <Card title="צ'ק ליסט למטבח" subtitle="תצוגה מהירה לשימוש בזמן האפייה על הטלפון.">
            <div className="grid gap-2">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="הערות חשובות" subtitle="הדברים שלא משנים במתכון הזה.">
            <ul className="space-y-3 text-sm leading-7 text-slate-700">
              {recipeNotes.map((note) => (
                <li key={note} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {note}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/15 px-4 py-3">
      <p className="text-sm text-orange-100/80">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function HighlightBox({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function ModeButton({ active, title, description, onClick }: { active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border px-4 py-4 text-right transition ${
        active
          ? "border-orange-400 bg-orange-50 shadow-lg shadow-orange-100"
          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
      }`}
    >
      <p className="text-base font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </button>
  );
}

function TimelineTime({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}
