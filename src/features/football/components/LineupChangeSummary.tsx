import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

type TeamApi = {
  player: Array<{ id: string; name: string; number: string; booking?: string }>;
  formation?: string;
};

type SideKey = "home" | "away";

type Props = {
  previousHome?: TeamApi | null;
  previousAway?: TeamApi | null;
  currentHome?: TeamApi | null;
  currentAway?: TeamApi | null;
  homeTeamName?: string;
  awayTeamName?: string;
};

const normalizeFormation = (formation?: string) => {
  const s = String(formation ?? "").trim();
  return s || "4-4-2";
};

const parseFormation = (formation?: string) => {
  const s = normalizeFormation(formation);
  const parts = s
    .split("-")
    .map((p) => Number.parseInt(p, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return parts.length ? parts : [4, 4, 2];
};

const toId = (p: { id: string; name: string }) => String(p?.id ?? "").trim() || String(p?.name ?? "").trim();

const buildPositionBuckets = (formation: string, players: TeamApi["player"]) => {
  const parts = parseFormation(formation);

  const starters = Array.isArray(players) ? players.slice(0, 11) : [];
  if (starters.length === 0) {
    return {
      starters: [] as TeamApi["player"],
      gk: [] as TeamApi["player"],
      defenders: [] as TeamApi["player"],
      midfielders: [] as TeamApi["player"],
      forwards: [] as TeamApi["player"],
    };
  }

  const gk = starters.slice(0, 1);
  const rest = starters.slice(1);

  const defCount = parts[0] ?? 4;
  const fwdCount = parts[parts.length - 1] ?? 2;
  const midCount = parts.slice(1, -1).reduce((s, n) => s + n, 0);

  const defenders = rest.slice(0, defCount);
  const midfielders = rest.slice(defCount, defCount + midCount);
  const forwards = rest.slice(defCount + midCount, defCount + midCount + fwdCount);

  return { starters, gk, defenders, midfielders, forwards };
};

const listNames = (players: TeamApi["player"], max = 3) => {
  const names = players
    .map((p) => String(p?.name ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names[2]}`;
};

const summarizeSide = (opts: {
  side: SideKey;
  teamName: string;
  previous?: TeamApi | null;
  current?: TeamApi | null;
}) => {
  const prev = opts.previous;
  const cur = opts.current;

  const prevFormation = normalizeFormation(prev?.formation);
  const curFormation = normalizeFormation(cur?.formation);

  const prevStarters = Array.isArray(prev?.player) ? prev!.player.slice(0, 11) : [];
  const curStarters = Array.isArray(cur?.player) ? cur!.player.slice(0, 11) : [];

  if (prevStarters.length === 0 || curStarters.length === 0) return "";

  const prevIds = new Set(prevStarters.map((p) => toId({ id: p.id, name: p.name })));
  const curIds = new Set(curStarters.map((p) => toId({ id: p.id, name: p.name })));

  const inPlayers = curStarters.filter((p) => !prevIds.has(toId({ id: p.id, name: p.name })));
  const outPlayers = prevStarters.filter((p) => !curIds.has(toId({ id: p.id, name: p.name })));

  const formationText = prevFormation === curFormation
    ? `kept the same formation (${curFormation})`
    : `switched formation from ${prevFormation} to ${curFormation}`;

  const changesCount = Math.max(inPlayers.length, outPlayers.length);
  const changesText = changesCount === 0
    ? "named an unchanged XI"
    : changesCount === 1
      ? `made 1 change to the XI (in: ${listNames(inPlayers, 1)}; out: ${listNames(outPlayers, 1)})`
      : `made ${changesCount} changes (in: ${listNames(inPlayers)}; out: ${listNames(outPlayers)})`;

  const prevBuckets = buildPositionBuckets(prevFormation, prevStarters);
  const curBuckets = buildPositionBuckets(curFormation, curStarters);

  const prevAttack = prevBuckets.forwards;
  const curAttack = curBuckets.forwards;

  const attackChanged = (() => {
    const prevAttackIds = new Set(prevAttack.map((p) => toId({ id: p.id, name: p.name })));
    const curAttackIds = new Set(curAttack.map((p) => toId({ id: p.id, name: p.name })));
    let diff = 0;
    for (const id of curAttackIds) if (!prevAttackIds.has(id)) diff += 1;
    for (const id of prevAttackIds) if (!curAttackIds.has(id)) diff += 1;
    return diff > 0;
  })();

  const attackText = attackChanged
    ? `Up front, the attackers now include ${listNames(curAttack)}.`
    : `The attacking trio/duo remains led by ${listNames(curAttack)}.`;

  const benchedText = outPlayers.length > 0 ? `${listNames(outPlayers)} ${outPlayers.length === 1 ? "was" : "were"} left out (likely benched).` : "";

  return `${opts.teamName} ${formationText} and ${changesText}. ${attackText}${benchedText ? ` ${benchedText}` : ""}`;
};

export default function LineupChangeSummary(props: Props) {
  const homeName = props.homeTeamName ?? "Home";
  const awayName = props.awayTeamName ?? "Away";

  const [isExpanded, setIsExpanded] = useState(false);

  const summary = useMemo(() => {
    const home = summarizeSide({ side: "home", teamName: homeName, previous: props.previousHome ?? null, current: props.currentHome ?? null });
    const away = summarizeSide({ side: "away", teamName: awayName, previous: props.previousAway ?? null, current: props.currentAway ?? null });

    const parts = [home, away].filter(Boolean);
    return parts.join(" \n\n");
  }, [awayName, homeName, props.currentAway, props.currentHome, props.previousAway, props.previousHome]);

  if (!summary) return null;

  const lines = summary.split("\n");
  const collapsedLines = 2;
  const hasMore = lines.length > collapsedLines;
  const visibleText = isExpanded ? summary : lines.slice(0, collapsedLines).join("\n");

  return (
    <div className="block-style p-4 md:p-6 mb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="theme-text font-semibold text-base">Lineup change summary</p>
          <p className="text-xs text-neutral-m6 mt-1">Compared to each team’s last played match</p>
        </div>
        <span
          className="text-neutral-m6 shrink-0"
          title="This summary is generated from lineup/formation data and may not reflect tactical nuances."
        >
          <InformationCircleIcon className="w-5 h-5" />
        </span>
      </div>

      <div className="mt-3 whitespace-pre-line text-sm text-neutral-m6">
        {visibleText}
      </div>

      {hasMore ? (

        <button

          type="button"

          className="mt-3 text-sm font-medium text-brand-secondary hover:underline"

          onClick={() => setIsExpanded((s) => !s)}

        >

          {isExpanded ? "Show less" : "Show more"}

        </button>

      ) : null}
    </div>
  );
}
