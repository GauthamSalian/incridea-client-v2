import React from "react";
import { FaSearch } from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type EventCategory = "TECHNICAL" | "NON_TECHNICAL" | "CORE" | "SPECIAL" | "ALL";
type DayFilter = "All Days" | "Day 1" | "Day 2" | "Day 3" | "Day 4";

interface EventSearchBarProps {
  searchQuery?: string;
  onSearchChange: (query: string) => void;
  selectedDay?: DayFilter;
  onDayChange: (day: DayFilter) => void;
  selectedCategory?: EventCategory;
  onCategoryChange: (category: EventCategory) => void;
  availableDays?: DayFilter[];
}

export const EventSearchBar: React.FC<EventSearchBarProps> = ({
  searchQuery = "",
  onSearchChange,
  selectedDay = "All Days",
  onDayChange,
  selectedCategory = "ALL",
  onCategoryChange,
  availableDays = ["All Days", "Day 1", "Day 2", "Day 3", "Day 4"],
}) => {
  const categories: { value: EventCategory; label: string }[] = [
    { value: "ALL", label: "All Categories" },
    { value: "TECHNICAL", label: "Technical" },
    { value: "NON_TECHNICAL", label: "Non Technical" },
    { value: "CORE", label: "Core" },
    { value: "SPECIAL", label: "Special" },
  ];

  const days: DayFilter[] = availableDays;

  return (
    <div className="border border-white/25 bg-white/11 backdrop-blur-[30px] rounded-xl p-3 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <input
            id="event-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 sm:py-3 pr-10 text-sm text-slate-50 placeholder:text-slate-400 shadow-lg shadow-slate-950/30 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            placeholder="Search events..."
          />
          <FaSearch
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
          <Menu>
            <MenuButton
              type="button"
              className="flex-1 sm:flex-none sm:w-24 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 sm:py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-300"
            >
              {selectedDay}
            </MenuButton>
            {/* Days Menu List */}
            <MenuItems
              transition
              anchor="bottom end"
              className="w-32 origin-top-right border border-white/25 bg-white/11 backdrop-blur-[30px] rounded-xl p-3 sm:p-4 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50"
            >
              {days.map((day) => (
                <MenuItem key={day}>
                  <button
                    onClick={() => onDayChange(day)}
                    className={`group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 justify-center ${
                      selectedDay === day ? "bg-sky-500/20 text-sky-300" : ""
                    }`}
                  >
                    {day}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          <Menu>
            <MenuButton
              type="button"
              className="flex-1 sm:flex-none sm:w-31 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 sm:py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-300"
            >
              {categories.find((c) => c.value === selectedCategory)?.label ||
                "Category"}
            </MenuButton>
            {/* Category Menu List */}
            <MenuItems
              transition
              anchor="bottom end"
              className="w-40 origin-top-right border border-white/25 bg-white/11 backdrop-blur-[30px] rounded-xl p-3 sm:p-4 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50"
            >
              {categories.map((category) => (
                <MenuItem key={category.value}>
                  <button
                    onClick={() => onCategoryChange(category.value)}
                    className={`group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 justify-center ${
                      selectedCategory === category.value
                        ? "bg-sky-500/20 text-sky-300"
                        : ""
                    }`}
                  >
                    {category.label}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default EventSearchBar;
