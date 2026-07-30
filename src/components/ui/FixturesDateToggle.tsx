import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { addDays, subDays, isToday, isYesterday, isTomorrow, format } from "date-fns";
import { CustomDatePicker } from "./CustomDatePicker";

export type FixturesMode = "live" | "date";

interface FixturesDateToggleProps {
  /** Current mode – "live" or "date" */
  fixturesMode: FixturesMode;
  /** Called when the user switches between live and date */
  onModeChange: (mode: FixturesMode) => void;
  /** Currently selected date */
  selectedDate: Date | null;
  /** Called when the user picks / navigates to a new date */
  onDateChange: (date: Date | null) => void;
  /** Optional custom label for the "live" button (default: "Live") */
  liveLabel?: string;
}

const getDateLabel = (date: Date | null, fallback = "Fixtures"): string => {
  if (!date) return fallback;
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
};

export const FixturesDateToggle = ({
  fixturesMode,
  onModeChange,
  selectedDate,
  onDateChange,
  liveLabel = "Live",
}: FixturesDateToggleProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const goToPreviousDay = () =>
    onDateChange(subDays(selectedDate || new Date(), 1));

  const goToNextDay = () =>
    onDateChange(addDays(selectedDate || new Date(), 1));

  const handleDatePick = (date: Date) => {
    onDateChange(date);
    onModeChange("date");
    setShowDatePicker(false);
  };

  const activeClass = "bg-brand-secondary text-white";
  const inactiveClass = "text-[#586069] dark:text-snow-200";
  const navBtnClass =
    "rounded-full border border-snow-200 p-2 text-[#586069] dark:border-white/10 dark:text-snow-200 hover:bg-snow-100 dark:hover:bg-white/5 transition";

  return (
    <div className="!p-0 overflow-visible z-10">
      <div className="flex flex-col md:flex-row md:items-center gap-3 pb-1 dark:text-snow-200">
        {/* Live / Date toggle */}
        <div className="flex w-full md:w-auto rounded-full bg-snow-100 p-1 dark:bg-white/5">
          <button
            type="button"
            className={`flex-1 md:flex-none rounded-full px-4 py-2 text-sm font-medium transition ${
              fixturesMode === "live" ? activeClass : inactiveClass
            }`}
            onClick={() => onModeChange("live")}
          >
            {liveLabel}
          </button>
          <button
            type="button"
            className={`flex-1 md:flex-none rounded-full px-4 py-2 text-sm font-medium transition ${
              fixturesMode === "date" ? activeClass : inactiveClass
            }`}
            onClick={() => onModeChange("date")}
          >
            {getDateLabel(selectedDate)}
          </button>
        </div>

        {/* Date navigation: ← DatePicker → */}
        <div className="flex items-center justify-between md:ml-auto md:justify-end md:gap-2">
          <button
            type="button"
            className={navBtnClass}
            onClick={goToPreviousDay}
            aria-label="Previous day"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-snow-200 px-4 py-2 text-sm text-[#586069] dark:border-white/10 dark:text-snow-200 hover:bg-snow-100 dark:hover:bg-white/5 transition"
              onClick={() => setShowDatePicker((v) => !v)}
            >
              <CalendarIcon className="h-4 w-4" />
              {getDateLabel(selectedDate, "Pick date")}
            </button>
            {showDatePicker && (
              <div className="absolute right-0 top-full z-[100] mt-2 rounded-2xl border border-snow-200 bg-white p-0 shadow-xl dark:border-white/10 dark:bg-[#111827]">
                <CustomDatePicker
                  selectedDate={selectedDate}
                  onChange={handleDatePick}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            className={navBtnClass}
            onClick={goToNextDay}
            aria-label="Next day"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
