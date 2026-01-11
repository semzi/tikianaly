import { useEffect, useState, type CSSProperties } from "react";
import { getPlayerById } from "@/lib/api/endpoints";
import GetPlayerImage from "@/components/common/GetPlayerImage";

type TeamApi = {
  player: Array<{ id: string; name: string; number: string; booking?: string }>;
  formation?: string;
};

type DemoPlayer = {
  number: string;
  name: string;
  pos: string;
  formation_pos?: string;
  image?: string;
  id: string;
};

type DemoTeam = {
  formation?: string;
  players?: DemoPlayer[];
  substitutes?: DemoPlayer[];
};

type DemoLineup = {
  home?: DemoTeam;
  away?: DemoTeam;
};

type RenderPlayer = {
  player_id: string;
  name: string;
  shirt_number: number;
  formation_pos?: number;
  pos?: string;
  image_url?: string;
  rating?: number;
  goals?: number;
  assists?: number;
  redCards?: number;
};

type SubOffInfo = {
  minute?: string;
  forNumber?: string;
};

export default function LineupBuilder({
  // Accept either `home`/`away` or `localteam`/`visitorteam` prop names for flexibility
  home,
  away,
  localteam,
  visitorteam,
  lineup,
  substitutions,
  coaches,
  playerStats,
  summary,
  homeFormation: homeFormationProp,
  awayFormation: awayFormationProp,
  onPlayerClick,
  homeTeamName,
  awayTeamName,
}: {
  home?: TeamApi;
  away?: TeamApi;
  localteam?: TeamApi;
  visitorteam?: TeamApi;
  lineup?: DemoLineup;
  substitutions?: any;
  coaches?: any;
  playerStats?: any;
  summary?: any;
  homeFormation?: string;
  awayFormation?: string;
  onPlayerClick?: (player: { playerId: string; playerName?: string }) => void;
  homeTeamName?: string;
  awayTeamName?: string;
}) {
  // prefer explicit home/away props, fall back to localteam/visitorteam
  const propHome = home ?? localteam;
  const propAway = away ?? visitorteam;
  const [showHome, setShowHome] = useState(true);
  const [showAway, setShowAway] = useState(true);

  const resolvedHomeTeamName = homeTeamName ?? "Home Team";
  const resolvedAwayTeamName = awayTeamName ?? "Away Team";


  // Convert API shape into internal lineup structure.
  const parseFormation = (formation = "4-4-2") => {
    // convert "4-2-3-1" -> [4,2,3,1]
    const parts = formation.split("-").map((p) => parseInt(p, 10)).filter(Boolean);
    return parts.length ? parts : [4, 4, 2];
  };

  const SidePanel = ({ className = "" }: { className?: string }) => {
    return (
      <div className={`rounded-xl bg-brand-secondary text-white ${className}`}>
        <div className="p-4">
          <div className="mb-4">
            <p className="font-bold text-base">Coaches</p>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between rounded-lg px-2 py-2 bg-black/15">
                <p className="text-sm font-semibold truncate">{resolvedHomeTeamName}</p>
                <p className="text-xs text-white/90 truncate">{homeCoachName || "—"}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg px-2 py-2 bg-black/15">
                <p className="text-sm font-semibold truncate">{resolvedAwayTeamName}</p>
                <p className="text-xs text-white/90 truncate">{awayCoachName || "—"}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold text-base">Substitutes</p>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm truncate">{resolvedHomeTeamName}</p>
                <p className="font-bold italic text-sm">{homeFormation}</p>
              </div>
              <div className="mt-3 max-h-[180px] overflow-auto pr-1 hide-scrollbar">
                {homeSubs.length ? (
                  <div className="grid grid-cols-1 hide-scrollbar sm:grid-cols-2 gap-x-6 gap-y-4">
                    {homeSubs.map((p) => (
                      <button
                        key={`home-sub-${p.player_id}`}
                        type="button"
                        onClick={() => onPlayerClick?.({ playerId: String(p.player_id), playerName: p.name })}
                        className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-black/10"
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/25 bg-black/10 shrink-0">
                          <GetPlayerImage playerId={p.player_id} alt={p.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[12px] leading-4 font-semibold truncate">{p.name}</p>
                          <p className="text-[10px] leading-3 text-white/80 truncate">
                            #{p.shirt_number || ""}{p.pos ? ` ${p.pos}` : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/90 px-2 py-1.5">No substitutes</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm truncate">{resolvedAwayTeamName}</p>
                <p className="font-bold italic text-sm">{awayFormation}</p>
              </div>
              <div className="mt-3 max-h-[180px] overflow-auto pr-1 hide-scrollbar">
                {awaySubs.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {awaySubs.map((p) => (
                      <button
                        key={`away-sub-${p.player_id}`}
                        type="button"
                        onClick={() => onPlayerClick?.({ playerId: String(p.player_id), playerName: p.name })}
                        className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-black/10"
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/25 bg-black/10 shrink-0">
                          <GetPlayerImage playerId={p.player_id} alt={p.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[12px] leading-4 font-semibold truncate">{p.name}</p>
                          <p className="text-[10px] leading-3 text-white/80 truncate">
                            #{p.shirt_number || ""}{p.pos ? ` ${p.pos}` : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/90 px-2 py-1.5">No substitutes</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const toRating = (v: unknown) => {
    const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };

  const toInt = (v: unknown) => {
    const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const buildRatingLookup = (side: "home" | "away") => {
    const rows = Array.isArray(playerStats?.[side]) ? playerStats?.[side] : [];
    const map = new Map<string, number>();
    for (const r of rows) {
      const id = String(r?.id ?? "").trim();
      if (!id) continue;
      const rating = toRating(r?.rating);
      if (typeof rating === "number") map.set(id, rating);
    }
    return map;
  };

  const buildPlayerExtraLookup = (side: "home" | "away") => {
    const rows = Array.isArray(playerStats?.[side]) ? playerStats?.[side] : [];
    const map = new Map<string, { goals: number; assists: number; redCards: number }>();
    for (const r of rows) {
      const id = String(r?.id ?? "").trim();
      if (!id) continue;
      map.set(id, {
        goals: toInt(r?.goals),
        assists: toInt(r?.assists),
        redCards: toInt(r?.redcards),
      });
    }
    return map;
  };

  const buildSummaryCounts = (side: "home" | "away") => {
    const goalsMap = new Map<string, number>();
    const assistsMap = new Map<string, number>();

    const goalGroups = Array.isArray(summary?.[side]?.goals) ? summary?.[side]?.goals : [];
    for (const g of goalGroups) {
      const players = Array.isArray(g?.player) ? g?.player : [];
      for (const p of players) {
        const scorerId = String(p?.id ?? "").trim();
        if (scorerId) goalsMap.set(scorerId, (goalsMap.get(scorerId) ?? 0) + 1);

        const assistId = String(p?.assist_id ?? "").trim();
        if (assistId) assistsMap.set(assistId, (assistsMap.get(assistId) ?? 0) + 1);
      }
    }

    return { goalsMap, assistsMap };
  };

  const abbreviateName = (name: string) => {
    const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return String(name ?? "").trim();
    const first = parts[0];
    const last = parts[parts.length - 1];
    return `${first.charAt(0).toUpperCase()}. ${last}`;
  };

  const mapPlayersToFormationRows = (formation: string, players: RenderPlayer[]) => {
    const parts = parseFormation(formation);
    const totalOutfield = parts.reduce((s, v) => s + v, 0);
    const sorted = players
      .slice()
      .sort((a, b) => (a.formation_pos ?? 999) - (b.formation_pos ?? 999));

    const gk = sorted.slice(0, 1);
    const outfield = sorted.slice(1, 1 + totalOutfield);

    const rows: RenderPlayer[][] = [];
    rows.push(gk);

    let cursor = 0;
    for (const count of parts) {
      rows.push(outfield.slice(cursor, cursor + count));
      cursor += count;
    }

    // if API sends extras or formation counts mismatch, append remaining to last row
    const remaining = sorted.slice(1 + totalOutfield);
    if (remaining.length) {
      if (rows.length) rows[rows.length - 1] = [...rows[rows.length - 1], ...remaining];
    }

    return rows;
  };

  const buildTeamFromDemo = (team?: DemoTeam) => {
    const formation = String(team?.formation ?? "4-4-2").trim() || "4-4-2";
    const players = Array.isArray(team?.players) ? team!.players! : [];
    if (players.length === 0) return null;

    const starting: RenderPlayer[] = players
      .map((p) => ({
        player_id: String(p.id ?? ""),
        name: String(p.name ?? ""),
        shirt_number: Number(String(p.number ?? "0")) || 0,
        formation_pos: toNumber((p as any).formation_pos) ?? undefined,
        pos: String((p as any).pos ?? ""),
        image_url: String((p as any).image ?? "").trim() || undefined,
      }))
      .filter((p) => p.player_id && p.name);

    // If formation_pos is missing, keep the incoming order.
    const hasFormationPos = starting.some((p) => typeof p.formation_pos === "number");
    const ordered = hasFormationPos
      ? starting.slice().sort((a, b) => (a.formation_pos ?? 999) - (b.formation_pos ?? 999))
      : starting;

    return {
      formation,
      starting: ordered,
    };
  };

  const buildSubsFromDemo = (team?: DemoTeam) => {
    const subs = Array.isArray(team?.substitutes) ? team!.substitutes! : [];
    if (!subs.length) return [] as RenderPlayer[];
    return subs
      .map((p) => ({
        player_id: String(p.id ?? ""),
        name: String(p.name ?? ""),
        shirt_number: Number(String(p.number ?? "0")) || 0,
        formation_pos: toNumber((p as any).formation_pos) ?? undefined,
        pos: String((p as any).pos ?? ""),
        image_url: String((p as any).image ?? "").trim() || undefined,
      }))
      .filter((p) => p.player_id && p.name);
  };

  const buildTeamFromApi = (team?: TeamApi) => {
    if (!team || !Array.isArray(team.player) || team.player.length === 0) return null;
    const players = team.player;
    const formationParts = parseFormation(team.formation ?? "4-4-2");

    // GK is first
    const starting: Array<any> = [];
    const first = players[0];
    starting.push({ player_id: first.id, name: first.name, position: "Goalkeeper", shirt_number: Number(first.number || 0) });

    // remaining players
    const rest = players.slice(1);

    // defenders = first formation part
    const defendersCount = formationParts[0] ?? 4;
    const forwardsCount = formationParts[formationParts.length - 1] ?? 1;
    const midfieldCounts = formationParts.slice(1, -1);
    const midfieldersCount = midfieldCounts.reduce((s, v) => s + v, 0) || 0;

    let cursor = 0;
    const take = (n: number, position: string) => {
      const slice = rest.slice(cursor, cursor + n);
      cursor += n;
      slice.forEach((p) => starting.push({ player_id: p.id, name: p.name, position, shirt_number: Number(p.number || 0) }));
    };

    take(defendersCount, "Defender");
    if (midfieldersCount > 0) take(midfieldersCount, "Midfielder");
    // remaining -> forwards (if forwardsCount doesn't match remainder, use forwardsCount)
    const remaining = rest.length - cursor;
    const takeForwards = Math.max(forwardsCount, remaining);
    take(takeForwards, "Forward");

    return {
      team_id: "api-team",
      team_name: "API Team",
      formation: team.formation ?? "4-4-2",
      starting,
      substitutes: [],
    };
  };
  // Build lineups from provided props only (no demo data)
  const homeDemo = buildTeamFromDemo(lineup?.home);
  const awayDemo = buildTeamFromDemo(lineup?.away);
  const homeApi = propHome ? buildTeamFromApi(propHome) : null;
  const awayApi = propAway ? buildTeamFromApi(propAway) : null;

  const fromSubstitutions = (side: "localteam" | "visitorteam") => {
    const rows = Array.isArray(substitutions?.[side]) ? substitutions?.[side] : [];
    if (!rows.length) return [] as RenderPlayer[];
    const map = new Map<string, RenderPlayer>();
    for (const r of rows) {
      const id = String(r?.player_in_id ?? "").trim();
      const name = String(r?.player_in_name ?? "").trim();
      if (!id || !name) continue;
      map.set(id, {
        player_id: id,
        name,
        shirt_number: Number(r?.player_in_number ?? 0) || 0,
      });
    }
    return Array.from(map.values());
  };

  const subOutLookup = (side: "localteam" | "visitorteam") => {
    const rows = Array.isArray(substitutions?.[side]) ? substitutions?.[side] : [];
    const map = new Map<string, SubOffInfo>();
    for (const r of rows) {
      const outId = String(r?.player_out_id ?? r?.off_id ?? "").trim();
      if (!outId) continue;
      const minute = String(r?.minute ?? "").trim();
      const forNumber = String(r?.player_in_number ?? r?.on_number ?? "").trim();
      map.set(outId, {
        minute: minute || undefined,
        forNumber: forNumber || undefined,
      });
    }
    return map;
  };

  const getLineupTeamSubs = (teamSide: "home" | "away") => {
    const rows = Array.isArray((lineup as any)?.[teamSide]?.substitutions) ? (lineup as any)?.[teamSide]?.substitutions : [];
    const map = new Map<string, SubOffInfo>();
    for (const r of rows) {
      const outId = String(r?.off_id ?? r?.player_out_id ?? "").trim();
      if (!outId) continue;
      const minute = String(r?.minute ?? "").trim();
      const forNumber = String(r?.on_number ?? r?.player_in_number ?? "").trim();
      map.set(outId, {
        minute: minute || undefined,
        forNumber: forNumber || undefined,
      });
    }
    return map;
  };

  const homeSubsFromLineup: RenderPlayer[] = buildSubsFromDemo(lineup?.home);
  const awaySubsFromLineup: RenderPlayer[] = buildSubsFromDemo(lineup?.away);

  const homeSubs: RenderPlayer[] = homeSubsFromLineup.length ? homeSubsFromLineup : fromSubstitutions("localteam");
  const awaySubs: RenderPlayer[] = awaySubsFromLineup.length ? awaySubsFromLineup : fromSubstitutions("visitorteam");

  const homeSubbedOff = (() => {
    const m = getLineupTeamSubs("home");
    return m.size ? m : subOutLookup("localteam");
  })();

  const awaySubbedOff = (() => {
    const m = getLineupTeamSubs("away");
    return m.size ? m : subOutLookup("visitorteam");
  })();

  const ratingHome = buildRatingLookup("home");
  const ratingAway = buildRatingLookup("away");

  const extraHome = buildPlayerExtraLookup("home");
  const extraAway = buildPlayerExtraLookup("away");

  const summaryHome = buildSummaryCounts("home");
  const summaryAway = buildSummaryCounts("away");

  const homeCoachName = coaches?.localteam?.name ?? coaches?.localteam ?? undefined;
  const awayCoachName = coaches?.visitorteam?.name ?? coaches?.visitorteam ?? undefined;

  const homeFormation = String(homeFormationProp ?? homeDemo?.formation ?? homeApi?.formation ?? "4-4-2");
  const awayFormation = String(awayFormationProp ?? awayDemo?.formation ?? awayApi?.formation ?? "4-4-2");

  const homeStartingPlayers: RenderPlayer[] = (homeDemo?.starting ?? homeApi?.starting ?? []).map((p: any) => ({
    player_id: String(p.player_id ?? p.id ?? ""),
    name: String(p.name ?? ""),
    shirt_number: Number(p.shirt_number ?? p.number ?? 0) || 0,
    formation_pos: toNumber(p.formation_pos) ?? undefined,
    pos: String(p.pos ?? ""),
    image_url: String(p.image_url ?? p.image ?? "").trim() || undefined,
    rating: ratingHome.get(String(p.player_id ?? p.id ?? "")),
    goals:
      (extraHome.get(String(p.player_id ?? p.id ?? ""))?.goals ?? 0) ||
      (summaryHome.goalsMap.get(String(p.player_id ?? p.id ?? "")) ?? 0),
    assists:
      (extraHome.get(String(p.player_id ?? p.id ?? ""))?.assists ?? 0) ||
      (summaryHome.assistsMap.get(String(p.player_id ?? p.id ?? "")) ?? 0),
    redCards: extraHome.get(String(p.player_id ?? p.id ?? ""))?.redCards ?? 0,
  }));

  const awayStartingPlayers: RenderPlayer[] = (awayDemo?.starting ?? awayApi?.starting ?? []).map((p: any) => ({
    player_id: String(p.player_id ?? p.id ?? ""),
    name: String(p.name ?? ""),
    shirt_number: Number(p.shirt_number ?? p.number ?? 0) || 0,
    formation_pos: toNumber(p.formation_pos) ?? undefined,
    pos: String(p.pos ?? ""),
    image_url: String(p.image_url ?? p.image ?? "").trim() || undefined,
    rating: ratingAway.get(String(p.player_id ?? p.id ?? "")),
    goals:
      (extraAway.get(String(p.player_id ?? p.id ?? ""))?.goals ?? 0) ||
      (summaryAway.goalsMap.get(String(p.player_id ?? p.id ?? "")) ?? 0),
    assists:
      (extraAway.get(String(p.player_id ?? p.id ?? ""))?.assists ?? 0) ||
      (summaryAway.assistsMap.get(String(p.player_id ?? p.id ?? "")) ?? 0),
    redCards: extraAway.get(String(p.player_id ?? p.id ?? ""))?.redCards ?? 0,
  }));

  // If neither lineup is provided, show a friendly message
  if (homeStartingPlayers.length === 0 && awayStartingPlayers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <p className="theme-text">Lineup not available</p>
      </div>
    );
  }

  const homeRows = mapPlayersToFormationRows(homeFormation, homeStartingPlayers);
  const awayRows = mapPlayersToFormationRows(awayFormation, awayStartingPlayers);

  const getX = (side: "home" | "away", rowIndex: number, totalRows: number) => {
    const start = 6;
    const end = 44;
    const step = totalRows <= 1 ? 0 : (end - start) / (totalRows - 1);
    const homeX = start + rowIndex * step;
    return side === "home" ? homeX : 100 - homeX;
  };

  const getMobileRowY = (side: "home" | "away", rowIndex: number, totalRows: number) => {
    // Mobile pitch is portrait; we want players distributed along vertical depth (Y).
    // Home team sits on the top half (GK near top), away team on the bottom half.
    if (totalRows <= 1) return side === "home" ? 22 : 78;
    const homeStart = 14;
    const homeEnd = 46;
    const awayStart = 86;
    const awayEnd = 54;
    const start = side === "home" ? homeStart : awayStart;
    const end = side === "home" ? homeEnd : awayEnd;
    const step = (end - start) / (totalRows - 1);
    return start + rowIndex * step;
  };

  const getMobileX = (indexInRow: number, rowCount: number) => {
    // Distribute players across pitch width.
    return getY(indexInRow, rowCount);
  };

  const getY = (indexInRow: number, rowCount: number) => {
    if (rowCount <= 0) return 50;
    // keep some vertical padding so players are visually centered on the pitch
    const min = 4;
    const max = 96;
    return min + ((indexInRow + 1) / (rowCount + 1)) * (max - min);
  };

  const IconBadge = ({
    src,
    fallbackText,
    style,
    className = "",
  }: {
    src: string;
    fallbackText: string;
    style?: CSSProperties;
    className?: string;
  }) => {
    const [failed, setFailed] = useState(false);

    return (
      <span
        style={style}
        className={`bg-white rounded-full flex items-center justify-center border border-white/80 shadow-sm overflow-hidden ${className}`}
      >
        {failed ? (
          <span className="text-[8px] md:text-[9px] font-bold leading-none text-black">
            {fallbackText}
          </span>
        ) : (
          <img
            src={src}
            alt=""
            className="w-2 h-2 md:w-2.5 md:h-2.5"
            onError={() => setFailed(true)}
          />
        )}
      </span>
    );
  };

  const PlayerAvatar = ({
    playerId,
    shirtNumber,
    alt,
    className = "",
  }: {
    playerId: string | number;
    shirtNumber?: number;
    alt: string;
    className?: string;
  }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const controller = new AbortController();

      const run = async () => {
        try {
          setLoading(true);
          const res: any = await getPlayerById(String(playerId));
          if (controller.signal.aborted) return;

          const item = res?.responseObject?.item;
          const player = Array.isArray(item) ? item[0] : item;
          const rawImage = player?.image ? String(player.image).trim() : "";

          if (rawImage) {
            const dataUri = rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
            setImageUrl(dataUri);
          } else {
            setImageUrl(null);
          }
        } catch {
          if (controller.signal.aborted) return;
          setImageUrl(null);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      };

      if (playerId === null || playerId === undefined || String(playerId).trim() === "") {
        setImageUrl(null);
        setLoading(false);
        return () => {
          controller.abort();
        };
      }

      run();

      return () => {
        controller.abort();
      };
    }, [playerId]);

    if (loading) {
      return <div className={`animate-pulse bg-gray-300 rounded-full ${className}`} />;
    }

    if (!imageUrl) {
      return (
        <div className={`bg-white/90 text-black rounded-full flex items-center justify-center ${className}`}>
          <span className="text-[10px] md:text-[11px] font-bold leading-none">
            {shirtNumber ? String(shirtNumber) : ""}
          </span>
        </div>
      );
    }

    return <img src={imageUrl} alt={alt} className={`object-cover ${className}`} />;
  };

  const PlayerDot = ({
    player,
    subOff,
  }: {
    player: RenderPlayer;
    subOff?: SubOffInfo;
  }) => {
    const rating = typeof player.rating === "number" ? player.rating : undefined;
    const ratingText = typeof rating === "number" ? rating.toFixed(1) : "—";

    const ratingClass = (() => {
      if (typeof rating !== "number") return "bg-white/90 text-black";
      if (rating < 6) return "bg-red-600 text-white";
      if (rating < 7) return "bg-yellow-400 text-black";
      if (rating < 8) return "bg-green-600 text-white";
      return "bg-blue-600 text-white";
    })();

    const hasRedCard = (player.redCards ?? 0) > 0;
    const goals = player.goals ?? 0;
    const assists = player.assists ?? 0;

    return (
      <button
        type="button"
        onClick={() => onPlayerClick?.({ playerId: String(player.player_id), playerName: player.name })}
        className="relative text-left"
      >
        <div className="relative w-7 h-7 md:w-9 md:h-9">
          <div
            className={`w-7 h-7 md:w-9 md:h-9 rounded-full overflow-hidden border border-white/60 shadow-sm ${
              hasRedCard ? "grayscale opacity-55" : ""
            }`}
          >
            <PlayerAvatar
              playerId={player.player_id}
              shirtNumber={player.shirt_number}
              alt={player.name}
              className="w-full h-full"
            />
          </div>
          <span
            className={`absolute -top-2 -right-2 w-[18px] h-[18px] md:w-[20px] md:h-[20px] ${ratingClass} rounded-full flex items-center justify-center text-[8px] md:text-[9px] leading-none text-center font-bold border border-white/80 shadow-sm`}
          >
            {ratingText}
          </span>

          {subOff ? (
            <span className="absolute -top-2 -left-2 z-20 w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-white rounded-full flex items-center justify-center border border-white/80 shadow-sm">
              <span className="relative w-3.5 h-3.5">
                <svg viewBox="0 0 24 24" className="absolute top-0 left-0 w-2.5 h-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 20V5"
                    stroke="#16A34A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10L12 5L17 10"
                    stroke="#16A34A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg viewBox="0 0 24 24" className="absolute bottom-0 right-0 w-2.5 h-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4V19"
                    stroke="#DC2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 14L12 19L17 14"
                    stroke="#DC2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          ) : null}

          {assists > 0 ? (
            <span className="absolute -bottom-2 -left-2 z-30 pointer-events-none">
              <span className="relative block w-3.5 h-3.5 md:w-4 md:h-4">
                {Array.from({ length: Math.min(assists, 3) }).map((_, idx) => (
                  <IconBadge
                    key={`assist-${player.player_id}-${idx}`}
                    src="/icons/assist.svg"
                    fallbackText={String(player.shirt_number ?? "")}
                    className="absolute w-3.5 h-3.5 md:w-4 md:h-4"
                    style={{ left: idx * 2, top: -idx * 2 }}
                  />
                ))}
              </span>
            </span>
          ) : null}

          {goals > 0 ? (
            <span className="absolute -bottom-2 -right-2 z-30 pointer-events-none">
              <span className="relative block w-3.5 h-3.5 md:w-4 md:h-4">
                {Array.from({ length: Math.min(goals, 3) }).map((_, idx) => (
                  <IconBadge
                    key={`goal-${player.player_id}-${idx}`}
                    src="/icons/football-line-1.svg"
                    fallbackText={String(player.shirt_number ?? "")}
                    className="absolute w-3.5 h-3.5 md:w-4 md:h-4"
                    style={{ right: idx * 2, top: -idx * 2 }}
                  />
                ))}
              </span>
            </span>
          ) : null}
        </div>
        <span className="absolute flex gap-x-1.5 left-1/2 top-full mt-1 -translate-x-1/2 text-[8px] md:text-[9px] text-white font-medium text-center bg-black/55 px-1.5 py-0.5 rounded max-w-[92px] md:max-w-[110px] truncate">
          {hasRedCard ? <span className="block w-2 h-3 bg-red-600 rounded-[2px] mx-auto mb-0.5" /> : null}
          {player.shirt_number ? `${player.shirt_number}. ` : ""}{abbreviateName(player.name)}
        </span>
      </button>
    );
  };

  return (
    <div className="">

      {/* Mobile pitch */}
      <div
        className="
            flex-7
        w-screen
        relative left-1/2 -ml-[50vw]
        aspect-[3/6]
        md:hidden
        relative
        overflow-hidden
      "
      >
        {/* Background pitch (scaled) */}
        <div
          className="
            absolute inset-0
            bg-[url('/pitch/light-long.svg')]
            dark:bg-[url('/pitch/dark-long.svg')]
            bg-center
            bg-no-repeat
            bg-[length:100%_100%]
            rotate-90
            scale-[1.8]
            origin-center
            pointer-events-none
          "
        />

        {/* Overlay (NOT scaled): players + controls */}
        <div className="absolute inset-0">
          <div className="home-half absolute inset-y-0 left-0 w-1/2 pointer-events-none" />
          <div className="away-half absolute inset-y-0 right-0 w-1/2 pointer-events-none" />

          {/* Toggle controls */}
          <div className="absolute top-3 left-3 z-5">
            <button
              type="button"
              onClick={() => setShowHome((s) => !s)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold ${showHome ? 'bg-blue-600 text-white' : 'bg-white/40 text-black'}`}
            >
              {showHome ? "Hide" : "Show"}
            </button>
          </div>
          <div className="absolute bottom-3 right-3 z-5">
            <button
              type="button"
              onClick={() => setShowAway((s) => !s)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold ${showAway ? 'bg-brand-secondary text-white' : 'bg-white/40 text-black'}`}
            >
              {showAway ? "Hide" : "Show"}
            </button>
          </div>

          <div className="absolute top-3 left-0 w-full flex justify-center pointer-events-none">
            <p className="theme-text font-bold italic text-sm">{homeFormation}</p>
          </div>
          <div className="absolute bottom-3 left-0 w-full flex justify-center pointer-events-none">
            <p className="theme-text font-bold italic text-sm">{awayFormation}</p>
          </div>

          {/* Home Team Players */}
          {showHome && homeRows.map((row, rowIndex) => {
            const totalRows = homeRows.length;
            const y = getMobileRowY("home", rowIndex, totalRows);
            return row.map((player, indexInRow) => {
              const x = getMobileX(indexInRow, row.length);
              const subOff = homeSubbedOff.get(String(player.player_id));
              return (
                <div
                  key={`home-${rowIndex}-${indexInRow}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <PlayerDot player={player} subOff={subOff} />
                </div>
              );
            });
          })}

          {/* Away Team Players (mirrored on the right half) */}
          {showAway && awayRows.map((row, rowIndex) => {
            const totalRows = awayRows.length;
            const y = getMobileRowY("away", rowIndex, totalRows);
            return row.map((player, indexInRow) => {
              const x = getMobileX(indexInRow, row.length);
              const subOff = awaySubbedOff.get(String(player.player_id));
              return (
                <div
                  key={`away-${rowIndex}-${indexInRow}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <PlayerDot player={player} subOff={subOff} />
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* Mobile panel below pitch */}
      <div className="md:hidden mt-4">
        <SidePanel />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[320px_1fr] gap-6 items-start">
        <SidePanel />

        <div
          className="
            w-full
            aspect-[6/3]
            relative
            overflow-hidden
            rounded-xl
          "
        >
          <div
            className="
              absolute inset-0
              bg-[url('/pitch/light-long.svg')]
              dark:bg-[url('/pitch/dark-long.svg')]
              bg-center
              bg-no-repeat
              bg-cover
              origin-center
            "
          >
            <div className="home-half absolute inset-y-0 left-0 w-1/2 pointer-events-none" />
            <div className="away-half absolute inset-y-0 right-0 w-1/2 pointer-events-none" />

            <div className="absolute top-3 left-3 z-5">
              <button
                type="button"
                onClick={() => setShowHome((s) => !s)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold ${showHome ? 'bg-blue-600 text-white' : 'bg-white/40 text-black'}`}
              >
                {showHome ? "Hide" : "Show"}
              </button>
            </div>
            <div className="absolute top-3 right-3 z-5">
              <button
                type="button"
                onClick={() => setShowAway((s) => !s)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold ${showAway ? 'bg-brand-secondary text-white' : 'bg-white/40 text-black'}`}
              >
                {showAway ? "Hide" : "Show"}
              </button>
            </div>

            <div className="absolute bottom-3 left-0 w-1/2 flex justify-center pointer-events-none">
              <p className="text-white font-bold italic text-sm">{homeFormation}</p>
            </div>
            <div className="absolute bottom-3 right-0 w-1/2 flex justify-center pointer-events-none">
              <p className="text-white font-bold italic text-sm">{awayFormation}</p>
            </div>

            {showHome && homeRows.map((row, rowIndex) => {
              const totalRows = homeRows.length;
              const x = getX("home", rowIndex, totalRows);
              return row.map((player, indexInRow) => {
                const y = getY(indexInRow, row.length);
                const subOff = homeSubbedOff.get(String(player.player_id));
                return (
                  <div
                    key={`mobile-home-${rowIndex}-${indexInRow}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <PlayerDot player={player} subOff={subOff} />
                  </div>
                );
              });
            })}

            {showAway && awayRows.map((row, rowIndex) => {
              const totalRows = awayRows.length;
              const x = getX("away", rowIndex, totalRows);
              return row.map((player, indexInRow) => {
                const y = getY(indexInRow, row.length);
                const subOff = awaySubbedOff.get(String(player.player_id));
                return (
                  <div
                    key={`mobile-away-${rowIndex}-${indexInRow}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <PlayerDot player={player} subOff={subOff} />
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
