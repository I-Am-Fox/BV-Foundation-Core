import { useState } from 'react';

export default function Directive() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            {/* Toggle button: always top-left, high z-index, pointer events enabled */}
            <div className="fixed top-2 left-4 z-50">
                <button
                    className="text-xs text-black hover:text-green-300 cursor-pointer font-mono"
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {isVisible ? 'Hide Directive' : 'Pssst. Hey there.'}
                </button>
            </div>

            {/* Modal overlay: only mounted when visible, covers screen, pointer-events allowed */}
            {isVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="p-4 bg-black border border-green-500 rounded shadow-lg max-w-md">
                        <p className="text-green-300 text-sm whitespace-pre-line">
                            {`Maybe one day you'll see this.
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
It was meant to be a collaborative effort, and I am the only one left.`}
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-300"
                            onClick={() => setIsVisible(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
