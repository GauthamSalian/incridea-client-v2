import { useState, useEffect, useRef } from "react";
import TotemGlitch from "../components/effects/TotemGlitch";

function HomePage() {
  const [isInside, setIsInside] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [showPlayerB, setShowPlayerB] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchTotem, setGlitchTotem] = useState(false);
  const [glitchVideoIndex, setGlitchVideoIndex] = useState(0);
  const playerARef = useRef<HTMLVideoElement>(null);
  const playerBRef = useRef<HTMLVideoElement>(null);
  const peekARef = useRef<HTMLVideoElement>(null);
  const peekBRef = useRef<HTMLVideoElement>(null);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const biomeVideos = [
    "/landingpage/1.webm",
    "/landingpage/2.webm",
    "/landingpage/3.webm",
    "/landingpage/4.webm",
    "/landingpage/5.webm",
    "/landingpage/6.webm",
  ];

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // Page ready to render
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let startY = 0;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const previousHtmlOverscroll = htmlEl.style.overscrollBehaviorY;
    const previousBodyOverscroll = bodyEl.style.overscrollBehaviorY;
    const previousHtmlTouchAction = htmlEl.style.touchAction;
    const previousBodyTouchAction = bodyEl.style.touchAction;

    if (isMobile) {
      htmlEl.style.overflow = "hidden";
      bodyEl.style.overflow = "hidden";
      htmlEl.style.touchAction = "none";
      bodyEl.style.touchAction = "none";
    }

    htmlEl.style.overscrollBehaviorY = "none";
    bodyEl.style.overscrollBehaviorY = "none";

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      startY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (isMobile) {
        event.preventDefault();
        return;
      }

      if (event.touches.length !== 1) return;
      const currentY = event.touches[0].clientY;
      const isPullingDown = currentY > startY;
      const scrollTop = document.scrollingElement?.scrollTop ?? window.scrollY;

      if (isPullingDown && scrollTop <= 0) {
        event.preventDefault();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      htmlEl.style.overscrollBehaviorY = previousHtmlOverscroll;
      bodyEl.style.overscrollBehaviorY = previousBodyOverscroll;
      htmlEl.style.touchAction = previousHtmlTouchAction;
      bodyEl.style.touchAction = previousBodyTouchAction;
    };
  }, [isMobile]);

  useEffect(() => {
    const maskRadius = isMobile ? 150 : 350;

    const handlePointerMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--mask-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mask-y", `${e.clientY}px`);
      document.documentElement.style.setProperty(
        "--mask-radius",
        `${maskRadius}px`,
      );
      setIsInside(true);
    };

    const handlePointerLeave = () => {
      setIsInside(false);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      const maskRadius = 150;
      let rafId: number | null = null;

      const updateMaskPosition = (clientX: number, clientY: number) => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          document.documentElement.style.setProperty(
            "--mask-x",
            `${clientX}px`,
          );
          document.documentElement.style.setProperty(
            "--mask-y",
            `${clientY}px`,
          );
          document.documentElement.style.setProperty(
            "--mask-radius",
            `${maskRadius}px`,
          );
          setIsInside(true);
          rafId = null;
        });
      };

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches[0]) {
          updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
          updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const handleTouchEnd = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        setIsInside(false);
      };

      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      window.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });
      window.addEventListener("touchcancel", handleTouchEnd, {
        passive: true,
      });

      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const handleParallaxMove = (e: PointerEvent | TouchEvent) => {
      let clientX: number | undefined;

      if ("touches" in e) {
        clientX = e.touches[0]?.clientX;
      } else {
        clientX = e.clientX;
      }

      if (typeof clientX !== "number") return;

      const x = (clientX / window.innerWidth - 0.5) * 16;
      document.documentElement.style.setProperty("--parallax-x", `${x}px`);
    };

    document.documentElement.style.setProperty("--parallax-x", "0px");
    window.addEventListener("pointermove", handleParallaxMove, {
      passive: true,
    });
    window.addEventListener("touchmove", handleParallaxMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handleParallaxMove);
      window.removeEventListener("touchmove", handleParallaxMove);
    };
  }, []);

  const triggerTransition = () => {
    if (isTransitioning) return;

    const visibleIndex = showPlayerB ? nextVideoIndex : activeVideoIndex;
    const upcomingIndex = (visibleIndex + 1) % biomeVideos.length;
    const previousIndex =
      (visibleIndex - 1 + biomeVideos.length) % biomeVideos.length;

    setIsTransitioning(true);
    setGlitchTotem(true);
    setGlitchVideoIndex(previousIndex);

    // PRELOAD hidden player FIRST
    if (showPlayerB) {
      setActiveVideoIndex(upcomingIndex);
      prepareNextVideo(upcomingIndex, playerARef.current);
    } else {
      setNextVideoIndex(upcomingIndex);
      prepareNextVideo(upcomingIndex, playerBRef.current);
    }

    // Wait 2 frames for decode
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowPlayerB((prev) => !prev); // instant cut behind glitch
      });
    });

    setTimeout(() => {
      setGlitchTotem(false);
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      triggerTransition();
    }, 8000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  const handleTotemClick = () => {
    triggerTransition();
  };

  const prepareNextVideo = (index: number, ref: HTMLVideoElement | null) => {
    if (!ref) return;
    ref.src = biomeVideos[index];
    ref.load();
    ref.play().catch(() => {});
  };

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden">
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="biomeDistortion">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="4"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.02;0.03;0.02"
                dur="0.8s"
                repeatCount="1"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="40"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            >
              <animate
                attributeName="scale"
                values="40;60;40"
                dur="0.8s"
                repeatCount="1"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <style>
        {`
        /* Hide iOS video controls */
        video::-webkit-media-controls-panel, 
        video::-webkit-media-controls-play-button, 
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }

        @keyframes radialPulse {
          0% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(251, 191, 36, 0));
          }
          50% {
            filter: brightness(1.1) drop-shadow(0 0 40px rgba(251, 191, 36, 0.5));
          }
          100% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(251, 191, 36, 0));
          }
        }

        .bg-corner-slice {
  position: absolute;
  width: 60%;
  height: 40%;
  overflow: hidden;

  mix-blend-mode: screen;
  opacity: 0.35;

  filter: blur(0.7px);

  animation: bgSliceGlitch 0.18s steps(1, end) 1;
  will-change: transform, filter;
}

@keyframes bgSliceGlitch {
  0% {
    transform: translate(0, 0) scaleY(1);
    filter: none;
  }

  35% {
    transform: translate(-4px, -1px) scaleY(1.03);
    filter: drop-shadow(-2px 0 rgba(130, 70, 190, 0.45));
  }

  65% {
    transform: translate(3px, 1px) scaleY(0.97);
    filter: drop-shadow(2px 0 rgba(255, 255, 255, 0.35));
  }

  100% {
    transform: translate(0, 0) scaleY(1);
    filter: none;
  }
}

  `}
      </style>
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 10,
          transform: `translateX(var(--parallax-x)) scale(${isMobile ? 1.1 : 1.02})`,
          animation: "radialPulse 3s ease-in-out infinite",
        }}
      >
        {/* PLAYER A */}
        <video
          ref={playerARef}
          src={biomeVideos[activeVideoIndex]}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-0 ${
            showPlayerB ? "opacity-0" : "opacity-100"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disableRemotePlayback
          controls={false}
          aria-hidden
        />

        {/* PLAYER B */}
        <video
          ref={playerBRef}
          src={biomeVideos[nextVideoIndex]}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-0 ${
            showPlayerB ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disableRemotePlayback
          controls={false}
          aria-hidden
        />
      </div>

      {/* Hover Peek Overlay - Reveals the alternate video */}
      {!isTransitioning && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translateX(var(--parallax-x)) scale(${isMobile ? 1.1 : 1.02})`,
            animation: "radialPulse 3s ease-in-out infinite",
            maskImage: !isInside
              ? "none"
              : "radial-gradient(circle var(--mask-radius) at var(--mask-x) var(--mask-y), transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)",
            WebkitMaskImage: !isInside
              ? "none"
              : "radial-gradient(circle var(--mask-radius) at var(--mask-x) var(--mask-y), transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)",
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            zIndex: 20,
          }}
        >
          {/* Show the opposite player - always render both for synced playback */}
          <video
            ref={peekARef}
            src={biomeVideos[activeVideoIndex]}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
              showPlayerB ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            controls={false}
            aria-hidden
          />
          <video
            ref={peekBRef}
            src={biomeVideos[nextVideoIndex]}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
              showPlayerB ? "opacity-0" : "opacity-100"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            controls={false}
            aria-hidden
          />
        </div>
      )}

      {isInside && (
        <div
          className="pointer-events-none fixed"
          style={{
            left: "var(--mask-x)",
            top: "var(--mask-y)",
            width: "300px",
            height: "300px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
            transition: "none",
          }}
        />
      )}

      {/* Glitch Overlay (Persistent, Not Mounted) - Shows during transitions */}
      <div
        className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-75 ${
          glitchTotem ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          src={biomeVideos[glitchVideoIndex]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: `translateX(var(--parallax-x)) scale(${isMobile ? 1.1 : 1.02})`,
            filter: "url(#biomeDistortion)",
          }}
          disableRemotePlayback
          controls={false}
          aria-hidden
        />
      </div>

      <div
        className="absolute left-1/2 top-0 
             -translate-x-1/2 pt-4 
             pointer-events-none"
        style={{ zIndex: 40 }}
      >
        <img
          src="/landingpage/Incrideaici.webp"
          alt="Incridea ICI Logo"
          className="h-20 md:h-20 w-auto"
          decoding="async"
        />
      </div>

      <div
        className="absolute left-1/2 top-1/2 
             -translate-x-1/2 -translate-y-1/2 
             pointer-events-none"
        style={{ zIndex: 50, height: "70vh", maxHeight: "700px" }}
      >
        <div
          className="h-full flex items-center justify-center"
          style={{
            transform: `translateX(var(--parallax-x))`,
            transition: "transform 0.25s ease-out",
          }}
        >
          <TotemGlitch src="/landingpage/totem.webp" active={glitchTotem} />
        </div>
      </div>

      <button
        onClick={handleTotemClick}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 bg-transparent cursor-pointer hover:bg-white/5 transition-colors duration-300 rounded-lg"
        style={{
          zIndex: 100,
          height: "70vh",
          maxHeight: "700px",
        }}
        aria-label="Click to swap biomes"
      />
    </main>
  );
}

export default HomePage;
