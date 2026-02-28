import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MarioSprite = ({ state, onCollectMushroom }) => {
    const [frame, setFrame] = useState(0);

    // Animation logic for walking frames
    useEffect(() => {
        if (state === 'running') {
            const interval = setInterval(() => {
                setFrame(f => (f + 1) % 3);
            }, 150);
            return () => clearInterval(interval);
        } else {
            setFrame(0);
        }
    }, [state]);

    const ASSETS = {
        marioSheet: '/mario_sprites.png',
        bowser: '/bowser.png'
    };

    // Sprite segments (Assuming sheet layout: [Walk1, Walk2, Walk3, Jump, Victory])
    const getMarioSegment = () => {
        if (state === 'victory') return '75%'; // Last frame
        if (state === 'jumping') return '50%'; // 4th frame
        return `${(frame * 25)}%`; // First 3 frames 0, 25, 50... wait
    };

    return (
        <div className="relative flex items-end justify-center h-full w-full">
            <div className="flex items-end gap-16 relative">

                {/* Mario with Sprite Sheet Frame Animation */}
                <motion.div
                    animate={state === 'jumping' ? { y: -60 } : { y: 0 }}
                    className="relative w-16 h-20 overflow-hidden"
                    style={{
                        backgroundImage: `url(${ASSETS.marioSheet})`,
                        backgroundSize: '400% 100%', // 4 frames width
                        backgroundPosition: `${getMarioSegment()} 0%`,
                        backgroundRepeat: 'no-repeat',
                        // Simple magenta removal attempt via filter (experimental)
                        filter: 'contrast(1.2) saturate(1.2)'
                    }}
                >
                    {state === 'victory' && (
                        <div className="absolute -top-10 w-full text-center text-yellow-400 font-pixel text-[8px] animate-bounce">
                            COURSE CLEAR!
                        </div>
                    )}
                </motion.div>

                {/* Bowser */}
                <AnimatePresence>
                    {state === 'fighting' && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2, opacity: 1, x: [0, 5, -5, 0] }}
                            exit={{ scale: 0, opacity: 0, y: -100, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                            className="w-24 h-24"
                        >
                            <img
                                src={ASSETS.bowser}
                                alt="Bowser"
                                className="w-full h-full object-contain pixelated"
                                style={{ filter: 'contrast(1.1)' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Item Spawn */}
            <AnimatePresence>
                {state === 'mushroom-spawn' && (
                    <motion.div
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: -100, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onAnimationComplete={onCollectMushroom}
                        className="absolute bottom-24 w-12 h-12 flex items-center justify-center bg-yellow-400 border-4 border-black rounded-lg"
                    >
                        <span className="text-white text-[10px]">?</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarioSprite;
