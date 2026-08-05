/**
 * Shared American-football stat helpers. Kept out of component files so
 * Fast Refresh (react-refresh/only-export-components) stays happy.
 */

/**
 * American-football stat values are not plain numbers. Convert to a
 * comparable numeric value so bar widths and "winner" highlights work:
 *   "4/9"   -> 4/9 (efficiency ratio)
 *   "14:02" -> 842 seconds (clock)
 *   "3-25"  -> 25 (penalty yards — last segment)
 *   "238"   -> 238
 */
export const toNumeric = (value: string | number): number => {
  const s = String(value ?? "").trim();
  if (!s) return 0;
  if (s.includes("/")) {
    const [num, den] = s.split("/").map(parseFloat);
    return den ? (num || 0) / den : 0;
  }
  if (s.includes(":")) {
    const [minutes = 0, seconds = 0] = s.split(":").map(parseFloat);
    return minutes * 60 + seconds;
  }
  if (s.includes("-")) {
    const parts = s.split("-").map(parseFloat);
    return parts[parts.length - 1] || 0;
  }
  return parseFloat(s) || 0;
};

export const teamInitials = (team: string) =>
  team
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
