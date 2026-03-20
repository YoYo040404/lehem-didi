import { baseStages, bakeDurations, type BakeMode } from "./recipe";

export type TimelineStage = {
  key: string;
  title: string;
  detail: string;
  startMin: number;
  recommendedStartMin: number;
  endMin: number;
  recommendedEndMin: number;
  maxEndMin: number;
  windowLabel: string;
};

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatAbsoluteTime(totalMinutes: number) {
  const dayOffset = Math.floor(totalMinutes / (24 * 60));
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const time = `${pad(hours)}:${pad(minutes)}`;

  if (dayOffset <= 0) {
    return time;
  }

  return `${time} (+${dayOffset})`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}ש׳ ${mins}ד׳`;
  }

  if (hours > 0) {
    return `${hours}ש׳`;
  }

  return `${mins}ד׳`;
}

export function buildTimeline(startTime: string) {
  const startMinutes = parseTimeToMinutes(startTime);

  let minCursor = startMinutes;
  let recommendedCursor = startMinutes;
  let maxCursor = startMinutes;

  const stages: TimelineStage[] = baseStages.map((stage) => {
    const startMin = minCursor;
    const recommendedStartMin = recommendedCursor;

    minCursor += stage.minMinutes;
    recommendedCursor += stage.recommendedMinutes;
    maxCursor += stage.maxMinutes;

    const windowLabel =
      stage.minMinutes === stage.maxMinutes
        ? `זמן קבוע: ${formatDuration(stage.recommendedMinutes)}`
        : `מומלץ ${formatDuration(stage.recommendedMinutes)} · טווח ${formatDuration(stage.minMinutes)}–${formatDuration(stage.maxMinutes)}`;

    return {
      key: stage.key,
      title: stage.title,
      detail: stage.detail,
      startMin,
      recommendedStartMin,
      endMin: minCursor,
      recommendedEndMin: recommendedCursor,
      maxEndMin: maxCursor,
      windowLabel,
    };
  });

  return { stages, startMinutes, preBakeEnd: recommendedCursor };
}

export function buildBakeSummary(startTime: string, loafCount: number, bakeMode: BakeMode) {
  const { stages, preBakeEnd } = buildTimeline(startTime);
  const covered = bakeDurations.covered.recommended;
  const uncovered = bakeDurations.uncovered.recommended;
  const cooling = bakeDurations.cooling.recommended;
  const singleBakeMinutes = covered + uncovered;
  const totalBakeMinutes = bakeMode === "sequential" ? loafCount * singleBakeMinutes : singleBakeMinutes;

  const ovenOutTime = preBakeEnd + totalBakeMinutes;
  const readyToSliceTime = ovenOutTime + cooling;

  return {
    stages,
    bakeStartTime: preBakeEnd,
    singleBakeMinutes,
    totalBakeMinutes,
    ovenOutTime,
    readyToSliceTime,
    strategyLabel:
      bakeMode === "sequential"
        ? "אפייה ברצף — כל כיכר נכנסת אחרי שהקודמת מסיימת"
        : "אפייה יחד — כל הכיכרות נכנסות לאותה אפייה",
  };
}
