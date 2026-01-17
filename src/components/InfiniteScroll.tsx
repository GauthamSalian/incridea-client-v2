import React, { useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InfiniteScrollProps {
  items: ReactNode[];
  speed?: "slow" | "normal" | "fast";
  gap?: string;
  itemWidth?: string;
  direction?: "left" | "right";
  onItemClick?: (index: number) => void;
  pauseOnHover?: boolean;
  autoScroll?: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  speed = "normal",
  gap = "gap-6",
  itemWidth = "w-64",
  direction = "left",
  onItemClick,
  pauseOnHover = true,
  autoScroll = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Duplicate items multiple times for seamless looping
  const duplicatedItems = [...items, ...items, ...items];

  const speedClass =
    speed === "slow"
      ? "animate-scroll-slow"
      : speed === "fast"
        ? "animate-scroll-fast"
        : "animate-scroll";

  const directionClass = direction === "right" ? "animate-scroll-reverse" : "";

  const scrollManual = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollRef.current.scrollLeft;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  return (
    <>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll-slow {
          animation: scroll 50s linear infinite;
        }

        .animate-scroll-fast {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }

        .infinite-scroll-container:hover .animate-scroll {
          animation-play-state: paused;
        }

        .infinite-scroll-container:hover .animate-scroll-slow {
          animation-play-state: paused;
        }

        .infinite-scroll-container:hover .animate-scroll-fast {
          animation-play-state: paused;
        }

        .infinite-scroll-container:hover .animate-scroll-reverse {
          animation-play-state: paused;
        }

        /* Hide scrollbar for Chrome, Safari, Edge */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {autoScroll ? (
        <div
          className={`infinite-scroll-container overflow-hidden ${
            pauseOnHover ? "" : ""
          }`}
        >
          <div
            className={`flex ${gap} flex-nowrap whitespace-nowrap ${speedClass} ${directionClass}`}
            style={{
              width: `${(duplicatedItems.length / items.length) * 100}%`,
            }}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={index}
                className={`flex-none shrink-0 ${itemWidth} cursor-pointer transition-transform hover:scale-105 duration-300`}
                onClick={() => onItemClick?.(index % items.length)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={() => scrollManual("left")}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 group"
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-200 group-hover:text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide flex-1 mx-12"
            onScroll={updateScrollButtons}
          >
            <div className={`flex ${gap} pb-4 flex-nowrap whitespace-nowrap`}>
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`flex-none shrink-0 ${itemWidth} cursor-pointer transition-transform hover:scale-105 duration-300`}
                  onClick={() => onItemClick?.(index)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollManual("right")}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 group"
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-200 group-hover:text-white" />
          </button>
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
