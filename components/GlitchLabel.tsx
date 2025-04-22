import { useEffect, useState } from 'react';

const options = [
    'UNRESOLVED',
    'UN_RSLVED',
    'UNRES_ _ _ED',
    'UNRE████ED',
    'UNRES▯LVED',
    '⧼UNRESOLVED⧽',
];

export default function GlitchLabel() {
    const [text, setText] = useState(options[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const next = options[Math.floor(Math.random() * options.length)];
            setText(next);
        }, 900);
        return () => clearInterval(interval);
    }, []);

    return <span className="animate-glitch text-fuchsia-300">{text}</span>;
}
