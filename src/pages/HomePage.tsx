import { useState, useEffect, useRef } from "react";
import TotemGlitch from "../components/effects/TotemGlitch";

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [glitchTotem, setGlitchTotem] = useState(false);

  // List of 6 biome images
  const biomeImages = [
    "/landingpage/1.png",
    "/landingpage/2.png",
    "/landingpage/3.png",
    "/landingpage/4.png",
    "/landingpage/5.png",
    "/landingpage/6.png",
  ];

  // Background image paths - cycle through biomes
  const bottomLayerImage = `url('${biomeImages[bottomIndex]}')`;
  const topLayerImage = `url('${biomeImages[topIndex]}')`;

  // Create canvas for mask generation
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    canvasRef.current = canvas;
  }, []);

  // Simple noise function (pseudo-random)
  const noise = (x: number, y: number, seed: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  };

  // Generate distorted mask with wavy edges
  const generateDistortedMask = (radius: number, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return "";

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create image data for pixel manipulation
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Parameters for distortion
    const noiseScale = 0.02;
    const distortionAmount = 30;
    const waveFrequency = 8;

    // Invert radius - start large (100) and shrink to 0
    const invertedRadius = 100 - radius;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Generate wavy distortion at the edges
        const noiseValue1 = noise(x * noiseScale, y * noiseScale, time * 0.5);
        const noiseValue2 = noise(
          x * noiseScale + 100,
          y * noiseScale + 100,
          time * 0.7,
        );
        const wave =
          Math.sin(angle * waveFrequency + time * 2) * distortionAmount;
        const distortion = (noiseValue1 - 0.5) * distortionAmount + wave;

        // Calculate distorted radius (shrinking from edge inward)
        const distortedRadius = (invertedRadius / 100) * (width * 0.7);
        const edgeWidth = 40;
        const distortedDist = dist + distortion * noiseValue2;

        // Calculate alpha - opaque inside (showing top layer), transparent outside
        let alpha = 0;
        if (distortedDist < distortedRadius - edgeWidth) {
          alpha = 255; // Fully opaque inside (top layer visible)
        } else if (distortedDist < distortedRadius + edgeWidth) {
          // Smooth edge with noise
          const edgeProgress =
            (distortedDist - (distortedRadius - edgeWidth)) / (edgeWidth * 2);
          const edgeNoise = noise(
            x * noiseScale * 2,
            y * noiseScale * 2,
            time + 50,
          );
          alpha = Math.floor(
            (1 - edgeProgress + (edgeNoise - 0.5) * 0.5) * 255,
          );
          alpha = Math.max(0, Math.min(255, alpha));
        }

        const index = (y * width + x) * 4;
        data[index] = 0; // R
        data[index + 1] = 0; // G
        data[index + 2] = 0; // B
        data[index + 3] = alpha; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsInside(true);
    };

    const handleMouseLeave = () => {
      setIsInside(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Trigger transition animation
  const triggerTransition = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setGlitchTotem(true);

    // Generate initial full mask to prevent flash
    const initialMask = generateDistortedMask(100, 0);
    setMaskDataUrl(initialMask);

    // Animate mask expansion
    const duration = 800; // 800ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out cubic function
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Calculate radius (0 to 100%)
      const radius = easeInOutCubic * 100;

      // Generate distorted mask with animated noise
      const maskUrl = generateDistortedMask(radius, elapsed / 100);
      setMaskDataUrl(maskUrl);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // After animation: what's on bottom moves to top, next image goes to bottom
        const nextImageIndex = (bottomIndex + 1) % 6;
        setTopIndex(bottomIndex);
        setBottomIndex(nextImageIndex);
        setIsTransitioning(false);
        setMaskDataUrl("");
        setTimeout(() => {
          setGlitchTotem(false);
        }, 150);
      }
    };

    requestAnimationFrame(animate);
  };

  // Cycle through biomes every 10 seconds
  //  useEffect(() => {
  //   const interval = setInterval(() => {
  //     setGlitchTotem(true);

  //     // stop glitch after slices finish
  //     setTimeout(() => {
  //       setGlitchTotem(false);
  //     }, 450);
  //   }, 10000); // every 10s

  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTransitioning) return;

      // 1️⃣ Start glitch
      setGlitchTotem(true);

      // 2️⃣ Let glitch play first
      setTimeout(() => {
        triggerTransition();

        // 3️⃣ Stop glitch shortly after transition starts
        setTimeout(() => {
          setGlitchTotem(false);
        }, 450);
      }, 350); // glitch lead-in time
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [isTransitioning, bottomIndex]);

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
      <style>
        {`
        .bg-corner-slice {
  position: absolute;
  width: 60%;           /* 👈 not full width anymore */
  height: 40%;          /* 👈 feels corner-localized */
  background-size: cover;
  background-position: center;

  mix-blend-mode: screen;
  opacity: 0.2;

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
      {/* Bottom Layer - Current Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: bottomLayerImage,
          zIndex: 10,
        }}
        aria-hidden
      />

      {/* Top Layer - Next Background with Distorted Radial Mask */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: topLayerImage,
          maskImage: isTransitioning
            ? `url('${maskDataUrl}')`
            : !isInside
              ? "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)"
              : `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)`,
          WebkitMaskImage: isTransitioning
            ? `url('${maskDataUrl}')`
            : !isInside
              ? "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)"
              : `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)`,
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          zIndex: 20,
        }}
        aria-hidden
      />

      {/* Spotlight glow effect overlay */}
      {isInside && (
        <div
          className="pointer-events-none fixed"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
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

      {/* One-time horizontal background tear */}
      {/* Corner background slice glitches (sync with totem) */}
      {glitchTotem && (
        <div
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: 28 }}
        >
          {/* Top-left */}
          <div
            className="bg-corner-slice"
            style={{
              top: "0",
              left: "0",
              backgroundImage: bottomLayerImage,
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "0ms",
            }}
          />

          {/* Top-right */}
          <div
            className="bg-corner-slice"
            style={{
              top: "0",
              right: "0",
              backgroundImage: bottomLayerImage,
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "25ms",
            }}
          />

          {/* Bottom-left */}
          <div
            className="bg-corner-slice"
            style={{
              bottom: "0",
              left: "0",
              backgroundImage: bottomLayerImage,
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "40ms",
            }}
          />

          {/* Bottom-right */}
          <div
            className="bg-corner-slice"
            style={{
              bottom: "0",
              right: "0",
              backgroundImage: bottomLayerImage,
              WebkitMaskImage: softHorizontalMask,
              maskImage: softHorizontalMask,
              animationDelay: "55ms",
            }}
          />
        </div>
      )}

      {/* Totem Image - centered and visible across all realms */}
      {/* Totem Image */}
      <div
        className="absolute left-1/2 top-1/2 
             -translate-x-1/2 -translate-y-1/2 
             pointer-events-none"
        style={{ zIndex: 50 }}
      >
        <TotemGlitch src="/landingpage/totem.png" active={glitchTotem} />
      </div>

      {/* Transparent Totem Button - positioned over the totem */}
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
