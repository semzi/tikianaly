export type MatchUiState = "upcoming" | "timer" | "ht" | "ft";

export type MatchUiInfo = {
  state: MatchUiState;
  minutes: number;
};

const toFiniteNumber = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export const getMatchUiInfo = (input: { status?: unknown; timer?: unknown }): MatchUiInfo => {
  const rawStatus = String(input?.status ?? "").trim();
  const statusLower = rawStatus.toLowerCase();

  if (statusLower === "ht") {
    return { state: "ht", minutes: 0 };
  }

  if (
    statusLower === "ft" ||
    statusLower === "aet" ||
    statusLower === "pen" ||
    statusLower === "postponed" ||
    statusLower === "cancelled" ||
    statusLower === "canceled"
  ) {
    return { state: "ft", minutes: 0 };
  }

  const statusNum = toFiniteNumber(rawStatus);
  if (Number.isFinite(statusNum) && statusNum === 0) {
    return { state: "upcoming", minutes: 0 };
  }

  const timerNum = toFiniteNumber(input?.timer);
  const minutes = Number.isFinite(timerNum) && timerNum > 0
    ? timerNum
    : (Number.isFinite(statusNum) && statusNum > 0 ? statusNum : 0);

  if (minutes > 0) {
    return { state: "timer", minutes };
  }

  return { state: "upcoming", minutes: 0 };
};
