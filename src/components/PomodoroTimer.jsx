import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Sword, Timer } from 'lucide-react';

const TIMER_MODES = {
    work: { label: 'WORK', time: 25, color: 'var(--theme-accent)' },
    shortBreak: { label: 'SHORT BREAK', time: 5, color: '#4ADE80' },
    longBreak: { label: 'LONG BREAK', time: 15, color: '#3B82F6' },
};

const THEME_LABELS = {
    mario: { work: 'QUEST', shortBreak: 'PAUSE', longBreak: 'CASTLE' },
    pacman: { work: 'CHASE', shortBreak: 'COFFEE', longBreak: 'ARCADE' },
    sonic: { work: 'DASH', shortBreak: 'REST', longBreak: 'CHILL' },
    pokemon: { work: 'TRAIN', shortBreak: 'HEAL', longBreak: 'PC BOX' },
    zelda: { work: 'EXPLORE', shortBreak: 'CAMP', longBreak: 'SHRINE' },
};

const PomodoroTimer = ({ saga = 'mario' }) => {
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work.time * 60);
    const [isActive, setIsActive] = useState(false);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_MODES[newMode].time * 60);
        setIsActive(false);
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setTimeout(() => setIsActive(false), 0);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (timeLeft / (TIMER_MODES[mode].time * 60)) * 100;

    return (
        <div className="pro-panel flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Timer size={16} />
                <h3 className="text-[10px] uppercase font-pixel">
                    {THEME_LABELS[saga]?.[mode] || TIMER_MODES[mode].label} TIME
                </h3>
            </div>

            {/* DISPLAY */}
            <div className="relative w-full aspect-square max-w-[180px] flex items-center justify-center border-8 border-theme-border bg-black/20 overflow-hidden">
                {/* PROGRESS BAR (Vertical fill style) */}
                <div
                    className="absolute bottom-0 left-0 w-full transition-all duration-1000"
                    style={{
                        height: `${100 - progress}%`,
                        backgroundColor: TIMER_MODES[mode].color,
                        opacity: 0.3
                    }}
                />

                <div className="z-10 text-3xl font-pixel pixel-text-shadow">
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* CONTROLS */}
            <div className="flex gap-2">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="pro-button p-2"
                    title={isActive ? 'Pause' : 'Start'}
                >
                    {isActive ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                    onClick={() => switchMode(mode)}
                    className="pro-button p-2"
                    title="Reset"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* MODE SELECTOR */}
            <div className="grid grid-cols-3 gap-1 w-full mt-2">
                {Object.keys(TIMER_MODES).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={`text-[8px] p-2 border-2 transition-all ${mode === m
                            ? 'bg-[var(--theme-accent)] border-[var(--theme-border)] text-black'
                            : 'bg-black/20 border-transparent opacity-60'
                            }`}
                    >
                        {THEME_LABELS[saga]?.[m] || TIMER_MODES[m].label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PomodoroTimer;
