import { useState, useEffect, useRef } from "react";

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      }
    };

    requestAnimationFrame(animate);
  };

  // Cycle through biomes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      triggerTransition();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [topIndex, isTransitioning]);

  const handleTotemClick = () => {
    triggerTransition();
  };

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden">
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

      {/* Totem Image - centered and visible across all realms */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          zIndex: 50,
        }}
      >
        <img
          src="/landingpage/totem.png"
          alt="Totem"
          className="h-96 w-auto object-contain"
        />
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
