import { useEffect } from "react";
import { Link } from "react-router-dom";

type FantasyButtonVariant = "teal" | "amber" | "neon";

interface FantasyButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: FantasyButtonVariant;
  className?: string;
}

const STYLE_ID = "fantasy-button-styles";

function FantasyButton({
  to,
  children,
  variant = "teal",
  className = "",
}: FantasyButtonProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes breathe {
        0% { filter: brightness(1); }
        100% { filter: brightness(1.15); }
      }

      .ui-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        color: #eafff6;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        border: 1px solid rgba(90, 255, 220, 0.7);
        background:
          radial-gradient(circle at 50% 40%, rgba(120, 255, 200, 0.7), transparent 50%),
          linear-gradient(135deg, #0d5c45, #0a3f31);
        box-shadow:
          inset 0 2px 3px rgba(255, 255, 255, 0.35),
          inset 0 -3px 6px rgba(0, 0, 0, 0.6),
          inset 0 0 0 2px rgba(7, 66, 70, 0.7),
          inset 0 8px 16px rgba(255, 255, 255, 0.18),
          0 6px 16px rgba(0, 0, 0, 0.35);
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        overflow: hidden;
      }

      .ui-btn::before {
        content: "";
        position: absolute;
        inset: 2px;
        border-radius: 9999px;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.35) 0%,
          rgba(255, 255, 255, 0.08) 45%,
          rgba(0, 0, 0, 0.18) 100%
        );
        pointer-events: none;
        mix-blend-mode: screen;
        animation: breathe 4s ease-in-out infinite alternate;
      }

      .ui-btn::after {
        content: "";
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 6px;
        height: 6px;
        border-radius: 9999px;
        background: rgba(0, 0, 0, 0.18);
        pointer-events: none;
      }

      .ui-btn:hover {
        transform: translateY(-1px) scale(1.01);
        filter: brightness(1.05);
        box-shadow:
          inset 0 2px 3px rgba(255, 255, 255, 0.4),
          inset 0 -3px 6px rgba(0, 0, 0, 0.7),
          inset 0 0 0 2px rgba(7, 66, 70, 0.8),
          inset 0 10px 18px rgba(255, 255, 255, 0.2),
          0 10px 20px rgba(0, 0, 0, 0.4);
      }

      .ui-btn:hover::after {
        filter: drop-shadow(0 0 14px rgba(255, 215, 120, 0.9));
      }

      .ui-btn--amber {
        color: #2a1c00;
        border: 1px solid rgba(255, 220, 120, 0.9);
        background:
          radial-gradient(circle at 50% 40%, rgba(255, 235, 150, 0.6), transparent 50%),
          linear-gradient(135deg, #c57a15, #8a5a0a);
        box-shadow:
          inset 0 2px 3px rgba(255, 255, 255, 0.35),
          inset 0 -3px 6px rgba(0, 0, 0, 0.6),
          inset 0 0 0 2px rgba(120, 65, 0, 0.5),
          inset 0 8px 16px rgba(255, 255, 255, 0.2),
          0 6px 16px rgba(0, 0, 0, 0.35);
      }

      .ui-btn--amber:hover {
        box-shadow:
          inset 0 2px 3px rgba(255, 255, 255, 0.4),
          inset 0 -3px 6px rgba(0, 0, 0, 0.7),
          inset 0 0 0 2px rgba(120, 65, 0, 0.6),
          inset 0 10px 18px rgba(255, 255, 255, 0.25),
          0 10px 20px rgba(0, 0, 0, 0.4);
      }

      @keyframes neonGlow {
        0%, 100% {
          box-shadow:
            inset 0 0 10px rgba(0, 255, 255, 0.1),
            0 0 10px rgba(0, 255, 255, 0.4),
            0 0 20px rgba(0, 255, 255, 0.2);
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
        }
        50% {
          box-shadow:
            inset 0 0 15px rgba(0, 255, 255, 0.2),
            0 0 15px rgba(0, 255, 255, 0.6),
            0 0 30px rgba(0, 255, 255, 0.4);
          text-shadow: 0 0 15px rgba(0, 255, 255, 1);
        }
      }

      .ui-btn--neon {
        color: #00ffff;
        border: 2px solid rgba(0, 255, 255, 0.8);
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(0, 10, 30, 0.95));
        box-shadow:
          inset 0 0 10px rgba(0, 255, 255, 0.1),
          0 0 10px rgba(0, 255, 255, 0.4),
          0 0 20px rgba(0, 255, 255, 0.2);
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
        animation: neonGlow 3s ease-in-out infinite;
      }

      .ui-btn--neon:hover {
        box-shadow:
          inset 0 0 15px rgba(0, 255, 255, 0.2),
          0 0 20px rgba(0, 255, 255, 0.6),
          0 0 40px rgba(0, 255, 255, 0.4);
        text-shadow: 0 0 20px rgba(0, 255, 255, 1);
        transform: translateY(-2px) scale(1.02);
      }
    `;

    document.head.appendChild(style);
  }, []);

  return (
    <Link
      to={to}
      className={`ui-btn ${variant === "amber" ? "ui-btn--amber" : ""} ${variant === "neon" ? "ui-btn--neon" : ""} w-[clamp(140px,20vw,240px)] px-4 sm:px-6 md:px-8 lg:px-10 py-2 md:py-3 text-xs sm:text-sm md:text-base text-center ${className}`}
    >
      {children}
    </Link>
  );
}

export default FantasyButton;
