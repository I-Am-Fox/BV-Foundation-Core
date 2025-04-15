import { useEffect, useState } from 'react';

interface ConsoleTitleProps {
  words: string[];
  className?: string;
  pauseDuration?: number; // milliseconds
}

const ConsoleTitle = ({
                        words,
                        className = '',
                        pauseDuration = 1500,
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
    const typingDelay = 120;

    const timer = setTimeout(() => {
      let newText = '';
      let nextIndex = charIndex;

      if (direction === 'forward') {
        newText = word.substring(0, nextIndex + 1);
        nextIndex += 1;

        if (nextIndex > word.length) {
          setIsPaused(true);
          setTimeout(() => {
            setDirection('backward');
            setIsPaused(false);
          }, pauseDuration);
        } else {
          setCharIndex(nextIndex);
          setText(newText);
        }
      } else {
        newText = word.substring(0, nextIndex - 1);
        nextIndex -= 1;

        if (nextIndex < 0) {
          const nextWord = (wordIndex + 1) % words.length;
          setWordIndex(nextWord);
          setDirection('forward');
          setCharIndex(0);
          setText('');
        } else {
          setCharIndex(nextIndex);
          setText(newText);
        }
      }
    }, typingDelay);

    return () => clearTimeout(timer);
  }, [charIndex, direction, isPaused, wordIndex, words, pauseDuration]);

  return (
      <h1
          className={`text-4xl md:text-6xl font-mono text-green-400 ${className}`}
      >
        {text}
        <span
            className={`ml-1 ${
                showCaret ? 'opacity-100' : 'opacity-0'
            } transition-opacity`}
        >
        |
      </span>
      </h1>
  );
};

export default ConsoleTitle;
