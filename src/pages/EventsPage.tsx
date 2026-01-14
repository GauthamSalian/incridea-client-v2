import { useEffect, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import {
  type EventDayConfig,
  type PublicEvent,
  type PublicEventCategory,
} from "../api/public";
import EventPreviewCard from "../components/events/EventCard";

const CATEGORY_FILTERS: (PublicEventCategory | "ALL")[] = [
  "ALL",
  "TECHNICAL",
  "NON_TECHNICAL",
  "CORE",
  "SPECIAL",
];

const DAY_FILTERS = [
  { label: "Day 1", key: "day1" },
  { label: "Day 2", key: "day2" },
  { label: "Day 3", key: "day3" },
  { label: "Day 4", key: "day4" },
] as const;

type DayFilterLabel = (typeof DAY_FILTERS)[number]["label"] | "All";
type EventDayKey = keyof EventDayConfig;

function isSameUtcDay(left: Date, right: Date) {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

function toSlug(event: PublicEvent) {
  const base = event.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${event.id}`;
}

const MOCK_EVENTS = Array.from({ length: 9 }).map((_, i) => {
  const cats: PublicEventCategory[] = [
    "TECHNICAL",
    "NON_TECHNICAL",
    "CORE",
    "SPECIAL",
  ];
  return {
    id: `mock-${i + 1}`,
    name: i % 2 === 0 ? "ROBOWARS" : "CODE QUEST",
    description: "Experience the thrill of competition.",
    image:
      i % 2 === 0
        ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
        : "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070",
    category: cats[i % 4],
    rounds: [{ date: new Date().toISOString() }],
    venue: "Main Auditorium",
    minTeamSize: 1,
    maxTeamSize: 4,
    eventType: "TEAM_MULTIPLE_ENTRY",
    needRegistration: true,
    registered: false,
  };
}) as unknown as PublicEvent[];

function EventsPage() {
  const [categoryFilter, setCategoryFilter] = useState<
    PublicEventCategory | "ALL"
  >("ALL");
  const [dayFilter, setDayFilter] = useState<DayFilterLabel>("All");
  const [query, setQuery] = useState("");

  const eventsQuery = { isLoading: false, isError: false };
  const dayConfig = undefined;
  const events = MOCK_EVENTS;

  const availableDayFilters = useMemo<DayFilterLabel[]>(() => {
    const labels: DayFilterLabel[] = ["All"];
    DAY_FILTERS.forEach(({ label, key }) => {
      if (dayConfig?.[key as EventDayKey]) labels.push(label);
    });
    return labels;
  }, [dayConfig]);

  const activeDayKey = useMemo<EventDayKey | null>(() => {
    if (dayFilter === "All") return null;
    const mapping = DAY_FILTERS.find((item) => item.label === dayFilter);
    return mapping ? (mapping.key as EventDayKey) : null;
  }, [dayFilter]);

  const filteredEvents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery = event.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        categoryFilter === "ALL" || event.category === categoryFilter;
      const selectedDayIso = activeDayKey
        ? dayConfig?.[activeDayKey] ?? null
        : null;
      const matchesDay = !selectedDayIso
        ? true
        : event.rounds.some((round) => {
            if (!round.date) return false;
            return isSameUtcDay(new Date(round.date), new Date(selectedDayIso));
          });
      return matchesQuery && matchesCategory && matchesDay;
    });
  }, [dayConfig, events, categoryFilter, activeDayKey, query]);

  return (
    <section className="space-y-8 max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      <header className="space-y-2">
        <p className="text-sky-400 uppercase text-[10px] tracking-[0.2em] font-bold">
          Discover
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Events
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Explore the upcoming challenges. Filter by category or day to find
          your perfect match.
        </p>
      </header>

      <div className="bg-slate-900/40 border border-white/5 rounded-2xl space-y-4 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <AiOutlineSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all"
              placeholder="Search events..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  categoryFilter === category
                    ? "border-sky-500 bg-sky-500/20 text-sky-300"
                    : "border-white/5 bg-white/5 text-slate-400 hover:border-white/20"
                }`}
              >
                {category === "ALL" ? "All" : category.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {filteredEvents.map((event, index) => (
          <RouterLink
            key={event.id}
            to={`/events/${toSlug(event)}`}
            className="w-full flex justify-center"
          >
            <EventPreviewCard event={event} index={index} />
          </RouterLink>
        ))}
      </div>
    </section>
  );
}

export default EventsPage;
