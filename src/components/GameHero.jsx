import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const sagaData = {
    mario: {
        hero: '/mario_hero.png',
        label: 'MUSHROOM KINGDOM',
    },
    pacman: {
        hero: '/pacman_hero.png',
        label: 'ARCADE MAZE',
    },
    sonic: {
        hero: '/sonic_hero.png',
        label: 'GREEN HILL ZONE',
    },
    pokemon: {
        hero: '/pokemon_hero.png',
        label: 'PALLET TOWN',
    },
    zelda: {
        hero: '/zelda_hero.png',
        label: 'HYRULE FIELD',
    }
};

const GameHero = ({ saga = 'mario', state }) => {
    const current = sagaData[saga] || sagaData.mario;

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full p-4">
            {/* PROFESSIONAL RETRO FRAME */}
            <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={saga}
                className="relative w-full max-w-md aspect-video pro-panel overflow-hidden border-8"
                style={{
                    borderColor: 'var(--theme-border)',
                }}
            >
                {/* SCANLINE EFFECT */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                {/* HERO IMAGE */}
                <Motion.img
                    key={current.hero}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={current.hero}
                    alt={saga}
                    className="w-full h-full object-cover pixelated"
                />

                {/* OVERLAY LABEL */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-[8px] tracking-tighter text-center border-t-2 border-[var(--theme-border)]">
                    {current.label}
                </div>
            </Motion.div>

            {/* STATUS FX */}
            <AnimatePresence>
                {state === 'victory' && (
                    <Motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: -10, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 text-theme-accent font-pixel text-[12px] pixel-text-shadow"
                        style={{ color: 'var(--theme-accent)' }}
                    >
                        STAGE CLEAR!
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameHero;
