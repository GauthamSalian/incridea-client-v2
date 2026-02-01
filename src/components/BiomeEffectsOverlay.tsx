import { useEffect, useState } from "react";

interface BiomeEffectsOverlayProps {
  biomeIndex: number;
  isTransitioning?: boolean;
}

const BIOME_NAMES = ["lava", "snow", "city", "jungle", "desert", "forest"];

const STYLE_ID = "biome-effects-styles";

function BiomeEffectsOverlay({
  biomeIndex,
  isTransitioning = false,
}: BiomeEffectsOverlayProps) {
  const [biomeName, setBiomeName] = useState(BIOME_NAMES[biomeIndex] || "lava");

  useEffect(() => {
    setBiomeName(BIOME_NAMES[biomeIndex] || "lava");
  }, [biomeIndex]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes dustFloat {
        0% { transform: translateY(0) translateX(0); opacity: 0.08; }
        50% { transform: translateY(-20px) translateX(10px); opacity: 0.12; }
        100% { transform: translateY(-40px) translateX(-5px); opacity: 0.05; }
      }

      @keyframes snowFloat {
        0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.08; }
        50% { transform: translateY(-30px) translateX(15px) rotate(180deg); opacity: 0.1; }
        100% { transform: translateY(-60px) translateX(5px) rotate(360deg); opacity: 0.05; }
      }

      @keyframes sporesFloat {
        0% { transform: translateY(0) scale(1); opacity: 0.06; }
        50% { transform: translateY(-25px) scale(1.1); opacity: 0.1; }
        100% { transform: translateY(-50px) scale(0.9); opacity: 0.05; }
      }

      @keyframes emberFloat {
        0% { transform: translateY(0) scale(1); opacity: 0.1; }
        50% { transform: translateY(-30px) scale(0.8) rotate(90deg); opacity: 0.08; }
        100% { transform: translateY(-60px) scale(0.6) rotate(180deg); opacity: 0.04; }
      }

      @keyframes godRays {
        0% { opacity: 0.15; }
        50% { opacity: 0.25; }
        100% { opacity: 0.15; }
      }

      @keyframes heatWave {
        0% { transform: translateY(0) scaleY(1); filter: blur(0); }
        50% { transform: translateY(-4px) scaleY(1.02); filter: blur(1px); }
        100% { transform: translateY(0) scaleY(1); filter: blur(0); }
      }

      @keyframes holographicShimmer {
        0% { filter: hue-rotate(0deg) brightness(1); }
        50% { filter: hue-rotate(10deg) brightness(1.05); }
        100% { filter: hue-rotate(0deg) brightness(1); }
      }

      .biome-effects {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 25;
      }

      /* Particles Container */
      .biome-particles {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .particle {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
      }

      .particle--dust {
        width: 2px;
        height: 2px;
        animation: dustFloat 8s linear infinite;
      }

      .particle--snow {
        width: 3px;
        height: 3px;
        animation: snowFloat 12s linear infinite;
      }

      .particle--spore {
        width: 1.5px;
        height: 1.5px;
        animation: sporesFloat 10s linear infinite;
      }

      .particle--ember {
        width: 2px;
        height: 2px;
        background: radial-gradient(circle, rgba(255, 200, 100, 0.8), rgba(255, 100, 50, 0.4));
        animation: emberFloat 7s linear infinite;
      }

      .particle--light-dust {
        width: 1px;
        height: 1px;
        animation: dustFloat 6s linear infinite;
      }

      /* Light Interaction */
      .light-interaction {
        position: absolute;
        inset: 0;
      }

      .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse at center,
          transparent 0%,
          rgba(0, 0, 0, 0.1) 40%,
          rgba(0, 0, 0, 0.25) 100%
        );
        pointer-events: none;
      }

      .god-rays {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.05) 25%,
          rgba(255, 255, 255, 0.03) 50%,
          rgba(255, 255, 200, 0.05) 75%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: godRays 6s ease-in-out infinite;
      }

      /* Distortion Effects */
      .distortion-layer {
        position: absolute;
        inset: 0;
      }

      .heat-shimmer {
        animation: heatWave 3s ease-in-out infinite;
        filter: blur(0.5px);
      }

      .lava-distortion {
        animation: heatWave 2s ease-in-out infinite;
        filter: blur(1px);
      }

      .holographic-shimmer {
        animation: holographicShimmer 4s ease-in-out infinite;
      }
    `;

    document.head.appendChild(style);
  }, []);

  const getParticleConfig = (name: string) => {
    switch (name) {
      case "desert":
        return { type: "dust", count: 15, color: "rgba(200, 180, 150, 0.6)" };
      case "snow":
        return { type: "snow", count: 20, color: "rgba(255, 255, 255, 0.7)" };
      case "jungle":
        return { type: "spore", count: 18, color: "rgba(180, 200, 150, 0.5)" };
      case "lava":
        return { type: "ember", count: 12, color: "rgba(255, 150, 80, 0.6)" };
      case "city":
        return {
          type: "light-dust",
          count: 10,
          color: "rgba(200, 220, 255, 0.5)",
        };
      default:
        return { type: "dust", count: 12, color: "rgba(200, 200, 200, 0.5)" };
    }
  };

  const getDistortionClass = (name: string) => {
    switch (name) {
      case "desert":
        return "heat-shimmer";
      case "lava":
        return "lava-distortion";
      case "city":
        return "holographic-shimmer";
      default:
        return "";
    }
  };

  const config = getParticleConfig(biomeName);
  const distortionClass = getDistortionClass(biomeName);

  const particles = Array.from({ length: config.count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="biome-effects">
      {/* Particles */}
      <div className="biome-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle particle--${config.type}`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              backgroundColor: config.color,
            }}
          />
        ))}
      </div>

      {/* Light Interaction */}
      <div className="light-interaction">
        <div className="vignette" />
        <div className="god-rays" />
      </div>

      {/* Distortion Layer */}
      {distortionClass && !isTransitioning && (
        <div className={`distortion-layer ${distortionClass}`} />
      )}
    </div>
  );
}

export default BiomeEffectsOverlay;
