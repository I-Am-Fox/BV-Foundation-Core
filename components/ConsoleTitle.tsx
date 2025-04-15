import { useEffect, useState } from 'react';

interface ConsoleTitleProps {
  words: string[];
  className?: string;
  speed?: number;
  pauseTime?: number;
}

const ConsoleTitle = ({
  words,
  className = '',
  speed = 120,
  pauseTime = 1500,
}: ConsoleTitleProps) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [charIndex, setCharIndex] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const caretTimer = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500);
    return () => clearInterval(caretTimer);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const word = words[wordIndex];

    const timer = setTimeout(() => {
      let nextIndex = charIndex;

      if (direction === 'forward') {
        setText(word.substring(0, nextIndex + 1));
        nextIndex += 1;

        if (nextIndex > word.length) {
          setIsPaused(true);
          setTimeout(() => {
            setDirection('backward');
            setIsPaused(false);
          }, pauseTime);
        } else {
          setCharIndex(nextIndex);
        }
      } else {
        setText(word.substring(0, nextIndex - 1));
        nextIndex -= 1;

        if (nextIndex < 0) {
          setDirection('forward');
          setWordIndex((wordIndex + 1) % words.length);
          setCharIndex(0);
          setText('');
        } else {
          setCharIndex(nextIndex);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, direction, isPaused, pauseTime, speed, wordIndex, words]);

  return (
    <h1 className={`text-4xl md:text-6xl font-mono text-green-400 ${className}`}>
      {text}
      <span className={`ml-1 ${showCaret ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        |
      </span>
    </h1>
  );
};

export default ConsoleTitle;
