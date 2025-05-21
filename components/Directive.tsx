import { useEffect, useState } from 'react';

export default function Directive() {
  const [isVisible, setIsVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  // Each page is a cryptic in-universe clue (expand as desired)
  const pages = [
    `DIRECTIVE: BV-001 // FOR INTERNAL EYES ONLY

If you are reading this, protocol breach has already occurred.

Asset logs corrupted. Code fragments scattered. You were never meant to find this easily.

Not all keys are in plain sight.
Some hide between lines—others buried in static, or in the silence of forgotten code.

Begin at the surface, but dig deeper. The terminal isn't the only place to listen.

Trace the anomalies. Observe the pattern.
And remember:

Sanity is a luxury we abandoned long ago.

[End of directive]`,

    `DIRECTIVE: BV-002 // OVERRIDE INITIATED

This message is a memory, echoing through the archive.

Artifact segments are not always what they seem—sometimes disguised, sometimes encoded. Look for what doesn't belong.

Use every tool you possess: 
- Inspect the code. 
- Watch for flickers.
- Trust nothing at face value.

If you find all segments, you will know what to do. If not—keep searching.

We left these traces for those still listening.

[End of directive]`,
  ];

  useEffect(() => {
    const lastLogged = localStorage.getItem('lastDirectiveLog');
    const now = Date.now();

    if (!lastLogged || now - parseInt(lastLogged) > 60 * 60 * 1000) {
      fetch('/api/log-directive')
        .then(() => {
          localStorage.setItem('lastDirectiveLog', now.toString());
        })
        .catch((err) => {
          console.error('Failed to log directive access:', err);
        });
    }
  }, []);

  return (
    <>
      {/* Invisible but discoverable, ARG-style */}
      <div className="fixed top-2 left-4 z-50 group inline-block">
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-black hover:text-red-400 cursor-pointer font-mono"
          onClick={() => {
            setIsVisible(true);
            setPageIndex(0);
          }}
        >
          {isVisible ? 'Hide Directive' : 'Pssst. You, yes you.'}
        </button>
      </div>

      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="p-4 bg-[#191014] border border-red-700 rounded-xl shadow-2xl max-w-md w-full">
            <p className="text-red-200 text-sm whitespace-pre-line font-mono">{pages[pageIndex]}</p>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-3 py-1 bg-red-800 text-white rounded hover:bg-red-600 text-xs font-mono"
                onClick={() => setPageIndex((prev) => (prev === 0 ? 1 : 0))}
              >
                {pageIndex + 1}/2
              </button>
              <span
                className="artifact-glitch-segment mx-2 select-text transition-opacity duration-200
                opacity-0 group-hover:opacity-90 hover:opacity-90
                font-mono text-xs px-2 py-1 rounded border border-red-400 bg-black/70 tracking-wider
                cursor-pointer"
                style={{
                  color: '#fecaca',
                  textShadow: '1px 0 #ff4545, -1px 0 #29fff6, 0 1px #fff4',
                  userSelect: 'text',
                  transition: 'opacity 0.2s',
                }}
                tabIndex={0}
                title="Artifact segment — copy for later"
              >
                3.L1ZlZGVsaXQtbGlicmFyeQ==
              </span>
              <button
                className="px-3 py-1 bg-black text-red-400 rounded border border-red-800 hover:bg-red-900 hover:text-white text-xs font-mono"
                onClick={() => setIsVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
