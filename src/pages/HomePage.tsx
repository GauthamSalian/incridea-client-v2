import { useState, useEffect } from "react";

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  // Background image paths - swap these when button clicked
  const bottomLayerImage = isSwapped
    ? "url('/landingpage/lushbiome.png')"
    : "url('/landingpage/lavabiome.png')";
  const topLayerImage = isSwapped
    ? "url('/landingpage/lavabiome.png')"
    : "url('/landingpage/lushbiome.png')";

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

  const handleTotemClick = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Bottom Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: bottomLayerImage,
          opacity: 1,
          zIndex: 10,
        }}
        aria-hidden
      />

      {/* Top Layer with Explorer's Torch spotlight effect */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: topLayerImage,
          maskImage: !isInside
            ? "radial-gradient(circle 0px at 0px 0px, transparent 0%, black 100%)"
            : `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)`,
          WebkitMaskImage: !isInside
            ? "radial-gradient(circle 0px at 0px 0px, transparent 0%, black 100%)"
            : `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 45%, rgba(0,0,0,0.7) 65%, black 85%)`,
          transition: isInside
            ? "none"
            : "mask-image 0.4s ease-out, -webkit-mask-image 0.4s ease-out",
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
