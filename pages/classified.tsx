import { useState, useEffect, useRef } from 'react';

// This segment is only a piece of the key
const SEGMENT_PREFIX = '2.';
const SEGMENT_VALUE = 'cGVyc2lzdC1yZWFsaXR5';
const SEGMENT_DISPLAY = SEGMENT_PREFIX + SEGMENT_VALUE;

export default function ClassifiedCTF() {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [flicker, setFlicker] = useState(false);
  const [showSegment, setShowSegment] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const flickerTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function flickerLoop() {
      const delay = 3000 + Math.random() * 9000;
      flickerTimeout.current = setTimeout(() => {
        setFlicker(true);
        if (Math.random() < 1 / 3) {
          setShowSegment(true);
          setTimeout(() => {
            setShowSegment(false);
            setFlicker(false);
            flickerLoop();
          }, 2300); // Shorter, subtle appearance
        } else {
          setTimeout(() => {
            setFlicker(false);
            setShowSegment(false);
            flickerLoop();
          }, 300);
        }
      }, delay);
    }
    flickerLoop();
    return () => {
      if (flickerTimeout.current) clearTimeout(flickerTimeout.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your real full-key check
    if (userInput.trim() === 'U2FuaXR5YWJhbmRvbmVkcGVyc2lzdC1yZWFsaXR5L1ZlZGVsaXQtbGlicmFyeQ==') {
      setSuccess(true);
      setError(false);
    } else {
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center px-4">
          <div className="bg-[#2e0000e6] border-2 border-red-700 rounded-2xl shadow-2xl max-w-lg w-full px-8 py-8 flex flex-col items-center">
            <h2
              className="text-center text-xl md:text-2xl text-red-400 mb-4 tracking-wider"
              style={{ textShadow: '1px 0 #ff2b2b80, -1px 0 #43fff980, 0 2px #fff9' }}
            >
              BLACK VEIL // GHOST IN THE SYSTEM
            </h2>
            <h2 className="text-center text-lg md:text-xl text-red-400 mb-4 tracking-wider">
              Looking through the GitHub repository is strictly prohibited.
            </h2>
            <div className="font-mono text-red-200 text-sm mb-5 text-center opacity-90 leading-relaxed">
              <b className="text-red-400">OVERRIDE TERMINAL — CAPTURE-THE-FLAG</b>
              <br />
              <br />
              You are engaging with a live Black Veil ARG event.
              <br />
              <span className="text-red-300">
                Your mission: reconstruct the anomaly override key from artifact segments hidden
                across the entire network.
              </span>
              <br />
              <br />
              <b className="text-white/80">How it works:</b>
              <br />- <span className="text-red-400">Anomalous artifact segments</span> may appear
              at unpredictable moments throughout the site.
              <br />- <span className="text-red-400">Stay vigilant</span>: segments are brief, may
              appear in unlikely locations, and are not limited to this terminal. <br />-{' '}
              <span className="text-red-400">Segments may be hidden in the source code</span> of any
              page. Use your browser's developer tools to inspect elements and view the console.
              <br />-{' '}
              <span className="text-red-400">
                You may also have to encode certain words or phrases into base64.
              </span>{' '}
              Look out for anything that doesn't quite match the page...
              <br />
              <br />
              <b className="text-white/80">To reconstruct the key:</b>
              <br />- <span className="text-red-400">Copy each segment</span> as you discover them.
              Each is labeled. You must assemble them in order, omitting the segment numbers.
              <br />
              - When you believe you have the complete override key, submit it below to attempt
              access.
              <br />
              <br />
              <span className="text-red-500">
                Do not share override keys with unauthorized agents.
                <br />
                All access attempts are monitored.
              </span>
              <br />
              <br />
              <span className="text-red-500">Good luck.</span>
            </div>

            <button
              className="mt-3 bg-red-700 hover:bg-red-900 text-white font-mono text-base px-6 py-2 rounded-lg shadow-xl transition-all tracking-widest"
              onClick={() => setModalOpen(false)}
            >
              BEGIN
            </button>

            <div className="mt-10 italic text-center text-base opacity-90 font-mono">
              <span className="text-red-400" style={{ fontWeight: 500 }}>
                Sanity
              </span>
              <span className="text-red-300"> is a luxury we </span>
              <span className="text-red-400" style={{ fontWeight: 500 }}>
                abandoned
              </span>
              <span className="text-red-300"> long ago.</span>
            </div>
          </div>
          <style jsx>{`
            .bg-black\\/95 {
              background: rgba(0, 0, 0, 0.95);
            }
          `}</style>
        </div>
      )}

      <div
        className={`relative min-h-screen flex flex-col items-center justify-center bg-black ${flicker ? 'flicker-page-glitch' : ''}`}
      >
        {/* Scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="w-full h-full scanline-animation opacity-15" />
        </div>

        {/* Subtle artifact bar below navbar (but above rest of page) */}
        <div
          style={{ minHeight: '1.6rem', width: '100%' }}
          className="flex items-center justify-center select-text mt-2"
        >
          {showSegment && (
            <span
              className="artifact-glitch-segment"
              tabIndex={0}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                opacity: 0.72,
                background: 'rgba(22,0,0,0.7)',
                borderRadius: '0.34rem',
                color: '#fecaca',
                padding: '0.08em 0.35em',
                boxShadow: '0 0 2px #ff3131cc, 0 0 1px #fff4',
                marginTop: 2,
                cursor: 'copy',
                border: '1.5px solid #ff313188',
                userSelect: 'text',
              }}
            >
              {SEGMENT_DISPLAY}
            </span>
          )}
        </div>

        <div className="z-20 bg-[#2e0000e6] border border-red-700 rounded-xl shadow-2xl px-8 py-10 flex flex-col items-center gap-4 max-w-md w-full mt-4">
          <h3 className="text-red-400 font-mono text-lg mb-3 tracking-wider glitch-title">
            OVERRIDE TERMINAL
          </h3>
          <form
            className="w-full flex flex-col items-center gap-3"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="ENTER FULL OVERRIDE KEY"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                setError(false);
              }}
              className={`
                                w-80 px-4 py-2 rounded 
                                bg-[#180000] text-red-400 border border-red-700 font-mono mb-1 outline-none 
                                focus:border-cyan-400 transition-all text-lg text-center tracking-widest
                                ${error ? 'animate-shake border-red-500' : ''}
                                ${success ? 'border-green-600' : ''}
                            `}
              disabled={success}
            />
            <button
              type="submit"
              disabled={success || userInput.trim().length === 0}
              className={`
                                w-full py-3 mt-4 rounded-lg font-mono text-lg tracking-wide
                                ${success ? 'bg-green-600 text-white shadow-xl animate-flicker hover:bg-green-800' : 'bg-red-900 text-red-200 opacity-90 hover:bg-red-800 transition'}
                            `}
            >
              {success ? 'ACCESS GRANTED' : 'ENGAGE OVERRIDE'}
            </button>
          </form>
          {success && (
            <div className="text-green-400 font-mono mt-6 text-center text-lg">
              FINAL OVERRIDE ACCEPTED
              <br />
              Welcome, Agent.
            </div>
          )}
          {error && (
            <div className="text-red-400 font-mono mt-6 text-center text-base">
              Invalid key. Reconstruct and try again.
            </div>
          )}
          <div className="text-center text-red-300 font-mono text-xs mt-4 select-none glitch-title">
            The override key must be reconstructed from all anomaly segments discovered.
            <br />
            {showSegment ? (
              <span className="text-green-300 text-center">Segment detected: Copy quickly.</span>
            ) : (
              <span className="text-red-500 opacity-60 text-center">
                Monitor for anomalous artifacts.
              </span>
            )}
          </div>
        </div>
        <style jsx>{`
          .scanline-animation {
            width: 100vw;
            height: 100vh;
            background: repeating-linear-gradient(
              0deg,
              #19191b 0px,
              #19191b 7px,
              #2b181b 7px,
              #2b181b 14px
            );
            opacity: 0.13;
            animation: scan 2.9s infinite linear;
          }
          @keyframes scan {
            0% {
              opacity: 0.13;
            }
            45% {
              opacity: 0.24;
            }
            100% {
              opacity: 0.13;
            }
          }
          .animate-shake {
            animation: shake 0.18s;
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-4px);
            }
            75% {
              transform: translateX(4px);
            }
          }
          .animate-flicker {
            animation: flickerText 1.4s infinite alternate;
          }
          @keyframes flickerText {
            0%,
            100% {
              color: #fff;
            }
            52% {
              color: #ffdede;
            }
          }
          .glitch-title {
            text-shadow:
              2px 0 #ff2b2b80,
              -2px 0 #43fff980,
              0 2px #fff9;
            animation: flickerText 1.5s infinite alternate;
          }
          .flicker-page-glitch {
            animation: flicker-glitch 0.37s steps(2, end) both;
          }
          @keyframes flicker-glitch {
            0% {
              opacity: 1;
              filter: brightness(1);
            }
            10% {
              opacity: 0.4;
              filter: brightness(2.5) contrast(2.5);
            }
            18% {
              opacity: 0.65;
              filter: brightness(0.3) contrast(2.5);
            }
            27% {
              opacity: 0.15;
              filter: brightness(3.8) contrast(1.3);
            }
            42% {
              opacity: 0.75;
              filter: brightness(0.6) contrast(2.2);
            }
            65% {
              opacity: 0.5;
              filter: brightness(2.3) contrast(3.5);
            }
            88% {
              opacity: 0.95;
              filter: brightness(0.7) contrast(1.6);
            }
            100% {
              opacity: 1;
              filter: brightness(1);
            }
          }
        `}</style>
      </div>
    </>
  );
}
