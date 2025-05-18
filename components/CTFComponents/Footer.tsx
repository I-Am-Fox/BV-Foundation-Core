import Link from 'next/link';

export default function GlitchFooter() {
  return (
    <footer className="relative bg-black border-t border-red-700 text-red-200 text-xs font-mono px-6 py-4 mt-0 overflow-hidden z-20">
      {/* Glitch scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="w-full h-full scanline-glitch-footer" />
      </div>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center relative z-20">
        <p className="glitch-footer-title opacity-90 select-none">
          © {new Date().getFullYear()} BLACK VEIL OPERATIONS
        </p>
        <p className="glitch-footer-flicker opacity-60 text-center select-none">
          System Update v1.4 — Clearance protocols refreshed. Logged by Overseer.
        </p>
        <Link href="/privacy" className="underline hover:text-red-100 transition-colors">
          Privacy Protocols →
        </Link>
      </div>
      <style jsx>{`
        .scanline-glitch-footer {
          width: 100vw;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            #19191b 0px,
            #19191b 7px,
            #2b181b 7px,
            #2b181b 14px
          );
          opacity: 0.1;
          animation: scanFooter 3s infinite linear;
        }
        @keyframes scanFooter {
          0% {
            opacity: 0.1;
          }
          45% {
            opacity: 0.18;
          }
          100% {
            opacity: 0.1;
          }
        }
        .glitch-footer-title {
          text-shadow:
            2px 0 #ff2b2baa,
            -2px 0 #43fff9aa,
            0 2px #fff;
          animation: flickerFooter 2.7s infinite alternate;
        }
        @keyframes flickerFooter {
          0%,
          100% {
            filter: none;
          }
          50% {
            filter: brightness(1.22) drop-shadow(0 0 6px #ff000099);
          }
        }
        .glitch-footer-flicker {
          animation: footerFlickerText 2.2s infinite alternate;
        }
        @keyframes footerFlickerText {
          0%,
          100% {
            color: #ffe4e4;
          }
          40% {
            color: #fff;
          }
          80% {
            color: #ffb1b1;
          }
        }
      `}</style>
    </footer>
  );
}
