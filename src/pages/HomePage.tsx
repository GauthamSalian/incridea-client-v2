import { useState, useEffect, useRef } from "react";
import TotemGlitch from "../components/effects/TotemGlitch";

function HomePage() {
  const [isInside, setIsInside] = useState(false);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchTotem, setGlitchTotem] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState("");
  const bottomVideoRef = useRef<HTMLVideoElement>(null);
  const topVideoRef = useRef<HTMLVideoElement>(null);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const videoQuality = isMobile ? "mbl" : "pc";

  const biomeVideos = [
    `/landingpage/1${videoQuality}.webm`,
    `/landingpage/2${videoQuality}.webm`,
    `/landingpage/3${videoQuality}.webm`,
    `/landingpage/4${videoQuality}.webm`,
    `/landingpage/5${videoQuality}.webm`,
    `/landingpage/6${videoQuality}.webm`,
  ];

  useEffect(() => {
    const id = requestAnimationFrame(() => setPageReady(true));
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
    const previousHtmlOverflow = htmlEl.style.overflow;
    const previousBodyOverflow = bodyEl.style.overflow;

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
      htmlEl.style.overflow = previousHtmlOverflow;
      bodyEl.style.overflow = previousBodyOverflow;
    };
  }, [isMobile]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    canvasRef.current = canvas;
  }, []);

  useEffect(() => {
    if (!isTransitioning && isMobile && bottomVideoRef.current) {
      bottomVideoRef.current.currentTime = 0;

      const playPromise = bottomVideoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay blocked on iOS:", error);
        });
      }
    }
  }, [bottomIndex, isTransitioning, isMobile]);

  const noise = (x: number, y: number, seed: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  };

  const generateDistortedMask = (radius: number, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return "";

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const noiseScale = 0.02;
    const distortionAmount = 30;
    const waveFrequency = 8;

    const invertedRadius = 100 - radius;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const noiseValue1 = noise(x * noiseScale, y * noiseScale, time * 0.5);
        const noiseValue2 = noise(
          x * noiseScale + 100,
          y * noiseScale + 100,
          time * 0.7,
        );
        const wave =
          Math.sin(angle * waveFrequency + time * 2) * distortionAmount;
        const distortion = (noiseValue1 - 0.5) * distortionAmount + wave;

        const distortedRadius = (invertedRadius / 100) * (width * 0.7);
        const edgeWidth = 40;
        const distortedDist = dist + distortion * noiseValue2;

        let alpha = 0;
        if (distortedDist < distortedRadius - edgeWidth) {
          alpha = 255;
        } else if (distortedDist < distortedRadius + edgeWidth) {
          const edgeProgress =
            (distortedDist - (distortedRadius - edgeWidth)) / (edgeWidth * 2);
          alpha = Math.floor((1 - edgeProgress) * 255);
        }

        const index = (y * width + x) * 4;
        data[index + 3] = alpha;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  useEffect(() => {
    const maskRadius = isMobile ? 150 : 250;

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

    setIsTransitioning(true);
    setGlitchTotem(true);

    if (isMobile) {
      const transitionDuration = 450;

      setTimeout(() => {
        const nextImageIndex = (bottomIndex + 1) % 6;
        setTopIndex(bottomIndex);
        setBottomIndex(nextImageIndex);
        setIsTransitioning(false);
        setMaskDataUrl("");

        setTimeout(() => {
          if (bottomVideoRef.current) {
            bottomVideoRef.current.play().catch(() => {});
          }
          setGlitchTotem(false);
        }, 150);
      }, transitionDuration);
      return;
    }

    const initialMask = generateDistortedMask(100, 0);
    setMaskDataUrl(initialMask);

    const duration = isMobile ? 450 : 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const radius = progress * 100;
      const maskUrl = generateDistortedMask(radius, elapsed / 100);
      setMaskDataUrl(maskUrl);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const nextImageIndex = (bottomIndex + 1) % 6;
        setTopIndex(bottomIndex);
        setBottomIndex(nextImageIndex);
        setIsTransitioning(false);
        setMaskDataUrl("");
        setTimeout(() => setGlitchTotem(false), 150);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isMobile) return;

    const interval = setInterval(() => {
      if (isTransitioning) return;

      setGlitchTotem(true);

      setTimeout(() => {
        triggerTransition();

        setTimeout(() => {
          setGlitchTotem(false);
        }, 450);
      }, 350);
    }, 8000);

    return () => clearInterval(interval);
  }, [isTransitioning, bottomIndex, isMobile]);

  const handleTotemClick = () => {
    triggerTransition();
  };

  const softHorizontalMask = `
  linear-gradient(
    to bottom,
    transparent 0%,
    black 35%,
    black 65%,
    transparent 100%
  )
`;

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
        <video
          ref={bottomVideoRef}
          src={biomeVideos[bottomIndex]}
          className="w-full h-full object-cover pointer-events-none"
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

      {!isTransitioning && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translateX(var(--parallax-x)) scale(${isMobile ? 1.1 : 1.02})`,
            animation: "radialPulse 3s ease-in-out infinite",
            maskImage:
              !pageReady || !isInside
                ? "none"
                : "radial-gradient(circle var(--mask-radius) at var(--mask-x) var(--mask-y), transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)",
            WebkitMaskImage:
              !pageReady || !isInside
                ? "none"
                : "radial-gradient(circle var(--mask-radius) at var(--mask-x) var(--mask-y), transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)",
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            zIndex: 20,
          }}
        >
          <video
            ref={topVideoRef}
            src={biomeVideos[topIndex]}
            className="w-full h-full object-cover pointer-events-none"
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
      {isTransitioning && (
        <video
          src={biomeVideos[topIndex]}
          autoPlay
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          controls={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform"
          style={{
            transform: `translateX(var(--parallax-x)) scale(${isMobile ? 1.1 : 1.02})`,
            filter: "url(#biomeDistortion)",
            maskImage: !isMobile ? `url('${maskDataUrl}')` : "none",
            WebkitMaskImage: !isMobile ? `url('${maskDataUrl}')` : "none",
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            zIndex: 20,
          }}
          aria-hidden
        />
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

      {glitchTotem && (
        <div
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: 28 }}
        >
          <div
            className="bg-corner-slice"
            style={{
              top: "0",
              left: "0",
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "0ms",
            }}
          >
            <video
              src={biomeVideos[bottomIndex]}
              autoPlay
              muted
              playsInline
              disableRemotePlayback
              controls={false}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          <div
            className="bg-corner-slice"
            style={{
              top: "0",
              right: "0",
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "25ms",
            }}
          >
            <video
              src={biomeVideos[bottomIndex]}
              autoPlay
              muted
              playsInline
              disableRemotePlayback
              controls={false}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          <div
            className="bg-corner-slice"
            style={{
              bottom: "0",
              left: "0",
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "40ms",
            }}
          >
            <video
              src={biomeVideos[bottomIndex]}
              autoPlay
              muted
              playsInline
              disableRemotePlayback
              controls={false}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          <div
            className="bg-corner-slice"
            style={{
              bottom: "0",
              right: "0",
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "55ms",
            }}
          >
            <video
              src={biomeVideos[bottomIndex]}
              autoPlay
              muted
              playsInline
              disableRemotePlayback
              controls={false}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>
      )}

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
        style={{ zIndex: 50 }}
      >
        <div
          style={{
            transform: `translateX(var(--parallax-x)) scale(${isMobile ? 0.6 : 1})`,
            transition: "transform 0.25s ease-out",
          }}
        >
          <TotemGlitch src="/landingpage/totem.webp" active={glitchTotem} />
        </div>
      </div>

      <button
        onClick={handleTotemClick}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-80 bg-transparent cursor-pointer hover:bg-white/5 transition-colors duration-300 rounded-lg"
        style={{
          zIndex: 100,
        }}
        aria-label="Click to swap biomes"
      />
    </main>
  );
}

export default HomePage;
