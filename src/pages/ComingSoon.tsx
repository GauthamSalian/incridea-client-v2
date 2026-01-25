import LightRays from "../components/LightRays";

const ComingSoon = () => {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-b from-[#1a1026] via-[#0d0716] to-black">
      {/* ================= INLINE FONT (NO OTHER FILES TO TOUCH) ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes portalFlicker {
          0%, 33.33% {
            content: url('/comingsoon/on.png');
            opacity: 1;
          }
          33.34%, 100% {
            content: url('/comingsoon/off.png');
            opacity: 1;
          }
        }

        .cs-root {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .character-glow {
          filter: brightness(0.95);
          animation: portalFlicker 3s infinite;
        }

        .character-glow:hover {
          filter:
            brightness(1.1)
            drop-shadow(0 0 25px rgba(140,120,255,0.35))
            drop-shadow(0 0 60px rgba(120,100,255,0.25));
          transform: translateY(-6px);
        }
      `}</style>

      {/* ================= LIGHT RAYS (FULL WIDTH, GOES OVER PHOTO) ================= */}
      <LightRays
        className="absolute inset-0"
        raysColor="#a78bfa"
        raysSpeed={0.45}
        lightSpread={0.9}
        rayLength={3.6} // 🔥 longer rays
        fadeDistance={1.9}
        saturation={0.75}
        noiseAmount={0.12}
        distortion={0.05}
        followMouse={true}
      />

      {/* ================= CONTENT ================= */}
      <div className="cs-root relative z-10 flex h-full w-full">
        {/* LEFT SIDE */}
        <div className="flex h-full w-1/2 items-center">
          <div className="flex flex-col items-start pl-24">
            <div className="relative mb-4">
              <span className="absolute -left-10 -top-3 text-white/60 text-sm">
                ⌖
              </span>
              <h1 className="text-white text-[72px] font-semibold tracking-[0.28em] leading-none">
                PORTAL
              </h1>
            </div>

            <h2 className="ml-1 text-white/60 text-[22px] tracking-[0.45em] uppercase">
              IN
            </h2>

            <h1 className="mt-1 text-white text-[72px] font-semibold tracking-[0.28em] leading-none">
              PROGRESS
            </h1>

            <p className="mt-6 text-xs tracking-[0.4em] text-[#b8c6ff]">
              STAY TUNED
            </p>
          </div>
    <>
      <style>
        {`
          @keyframes portalFlicker {
            0%, 33.33% {
              content: url('/comingsoon/on.png');
            }
            33.34%, 100% {
              content: url('/comingsoon/off.png');
            }
          }
          
          .coming-soon {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #000000;
            gap: 2rem;
            position: relative;
            overflow: hidden;
          }
          
          .light-rays-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
          }
          
          .content-layer {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 2rem;
          }
          
          .flicker-portal {
            animation: portalFlicker 3s infinite;
            width: 600px;
            height: auto;
            position: relative;
            transition: filter 0.1s ease-out, drop-shadow 0.1s ease-out, transform 0.1s ease-out;
          }
          
          .content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
            transition: filter 0.1s ease-out, text-shadow 0.1s ease-out, transform 0.1s ease-out;
          }
          
          .coming-soon h1 {
            color: white;
            font-size: 2rem;
            margin: 0;
            transition: text-shadow 0.1s ease-out;
          }
          
          .path-image {
            position: absolute;
            bottom: -180px;
            left: 45%;
            transform: translateX(-50%);
            width: 1000px;
            max-width: none;
            z-index: 0;
            pointer-events: none;
            transition: transform 0.1s ease-out, filter 0.1s ease-out;
            opacity: 1;
          }

          .coming-soon p {
            color: #ccc;
            font-size: 0.9rem;
            margin: 0.5rem 0 0 0;
          }
        `}
      </style>
      <div className="coming-soon" ref={containerRef}>
        {/* Light rays in the background */}
        <div className="light-rays-background">
          <LightRays
            raysOrigin="top-center"
            raysColor="#c77dff"
            raysSpeed={1.2}
            lightSpread={0.15}
            rayLength={8}
            followMouse={true}
            mouseInfluence={0.4}
            fadeDistance={2.2}
            saturation={1.5}
            pulsating={true}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex h-full w-1/2 items-center justify-center">
          <img
            src="/comingsoon/on.png"
            alt="Character"
            className="character-glow h-[80%] object-contain transition-all duration-700 ease-out"
          />
            alt="Flickering Portal"
            className="flicker-portal"
            style={{
              transform: `translate(${(mousePos.x - 0.5) * -30}px, ${(mousePos.y - 0.5) * -30}px)`,
              filter: `
                brightness(${1 + (0.5 - mousePos.y) * 0.4})
                contrast(1.1)
                drop-shadow(${-lightAngleX * 0.3}px ${-lightAngleY * 0.5}px 40px rgba(199, 125, 255, ${0.6 - mousePos.y * 0.3}))
                drop-shadow(${-lightAngleX * 0.5}px ${-lightAngleY * 0.8}px 80px rgba(157, 78, 221, ${0.4 - mousePos.y * 0.2}))
              `
            }}
          />
          <img
            src="/comingsoon/path.png"
            alt="Path"
            className="path-image"
            style={{
              transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -10}px)`,
              filter: `brightness(${0.8 + (0.5 - mousePos.y) * 0.3}) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))`
            }}
          />
          <div className="content">
            <h1>
              COMING SOON
            </h1>
            <p>This module is still being worked across classes.</p>
            <p>Check back once she's safe to cross.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
