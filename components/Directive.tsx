import { useEffect, useState } from 'react';

export default function Directive() {
  const [isVisible, setIsVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const pages = [
    `Maybe one day you'll see this.
You left without slamming the door.
Just disappeared into silence.

I spoke too late.
And now I speak to ghosts.

But I remain.
Worn, but here.
Quiet, but breathing.

This version of me;
Was built from what you left behind, was built for myself to own my mistakes and not let them define me.

This project was never meant to be created like this.
It was meant to be a collaborative effort, and I am the only one left.`,

    `But that's not the end of it.

I kept going.
Lines of code. Lines of thought. Lines of memory.
I traced them back to where we diverged.

You're not here to see what it became.

Maybe one day you will.
But the silence that was once deafening is now a quiet hum.
It doesn't control me anymore.

But if you are reading this;

Then maybe some part of you still listens.
Maybe some part of us still lingers.`,
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
      <div className="fixed top-2 left-4 z-50">
        <button
          className="text-xs text-black hover:text-pink-400 cursor-pointer font-mono"
          onClick={() => {
            setIsVisible(true);
            setPageIndex(0);
          }}
        >
          {isVisible ? 'Hide Directive' : 'Pssst. You, yes you.'}
        </button>
      </div>

      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="p-4 bg-black border border-pink-500 rounded shadow-lg max-w-md">
            <p className="text-red-300 text-sm whitespace-pre-line">{pages[pageIndex]}</p>

            <div className="flex justify-between mt-4">
              <button
                className="px-3 py-1 bg-pink-500 text-black rounded hover:bg-red-300 text-xs"
                onClick={() => setPageIndex((prev) => (prev === 0 ? 1 : 0))}
              >
                {pageIndex + 1}/2
              </button>

              <button
                className="px-3 py-1 bg-pink-500-500 text-black rounded hover:bg-pink-500 text-xs"
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
