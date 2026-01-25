import { type PropsWithChildren } from "react";
import "./LiquidGlassCard.css";

type ColorScheme = "dark" | "orange" | "purple";

type LiquidGlassCardProps = PropsWithChildren<{
  className?: string;
  colorScheme?: ColorScheme;
}>;

export default function LiquidGlassCard({
  children,
  className = "",
  colorScheme = "dark",
}: LiquidGlassCardProps) {
  return (
    <>
      <div className={`card card--${colorScheme} ${className}`}>
        <div className="card__content">{children}</div>
      </div>

      <svg style={{ display: "none" }}>
        <filter id="displacementFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </>
  );
}
