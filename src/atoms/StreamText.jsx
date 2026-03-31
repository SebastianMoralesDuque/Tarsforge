import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Reveals text character by character with a blinking cursor.
 */
export default function StreamText({ text = '', speed = 18, className = '', skip = false, onComplete }) {
    const [displayed, setDisplayed] = useState('');
    const indexRef = useRef(0);
    const timerRef = useRef(null);
    const textRef = useRef(text);
    const skipFlagRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        textRef.current = text;
        onCompleteRef.current = onComplete;
    }, [text, onComplete]);

    const tick = useCallback(() => {
        if (skipFlagRef.current) return;
        
        indexRef.current += 1;
        setDisplayed(textRef.current.slice(0, indexRef.current));

        if (indexRef.current >= textRef.current.length) {
            clearInterval(timerRef.current);
            onCompleteRef.current?.();
        }
    }, []);

    useEffect(() => {
        skipFlagRef.current = skip;
        
        if (skip) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayed(text);
            indexRef.current = text.length;
            return;
        }

        indexRef.current = 0;
        if (!text) return;

        timerRef.current = setInterval(tick, speed);

        return () => clearInterval(timerRef.current);
    }, [text, speed, skip, tick]);

    const isDone = displayed.length >= text.length;

    return (
        <span className={['font-mono text-xs leading-relaxed break-words', className].join(' ')}>
            {displayed}
            {!isDone && (
                <span
                    className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
                    style={{ animation: 'blink-cursor 1s step-end infinite' }}
                />
            )}
        </span>
    );
}