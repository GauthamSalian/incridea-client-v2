import { useState, useEffect } from "react";

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Lava Biome - Bottom Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/landingpage/lavabiome.png')" }}
        aria-hidden
      />

      {/* Lush Biome - Top Layer with cursor reveal effect */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-75"
        style={{
          backgroundImage: "url('/landingpage/lushbiome.png')",
          maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
        }}
        aria-hidden
      />
    </main>
  );
}

export default HomePage;
