import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MarioSprite = ({ state, onCollectMushroom }) => {
    const [frame, setFrame] = useState(0);

    // Animation logic for walking frames (3 frames)
    useEffect(() => {
        if (state === 'running') {
            const interval = setInterval(() => {
                setFrame(f => (f + 1) % 3);
            }, 120);
            return () => clearInterval(interval);
        } else {
            setFrame(0);
        }
    }, [state]);

    const ASSETS = {
        marioSheet: '/mario_sprites.png',
        bowser: '/bowser.png'
    };

    // Frame Mapping (0:Walk1, 1:Walk2, 2:Walk3, 3:Jump, 4:Victory)
    const getMarioPosition = () => {
        if (state === 'victory') return '100% 0%';
        if (state === 'jumping') return '75% 0%';
        return `${(frame * 25)}% 0%`; // Steps of 25% for first 3 frames
    };

    return (
        <div className="relative flex items-end justify-center h-full w-full">
            <div className="flex items-end gap-16 relative">

                {/* Mario with Sprite Sheet Frame Animation */}
                <motion.div
                    animate={state === 'jumping' ? { y: -70 } : { y: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative w-20 h-24 overflow-hidden"
                    style={{
                        backgroundImage: `url(${ASSETS.marioSheet})`,
                        backgroundSize: '500% 100%', // 5 frames
                        backgroundPosition: getMarioPosition(),
                        backgroundRepeat: 'no-repeat',
                        mixBlendMode: 'multiply', // Hides WHITE background
                        imageRendering: 'pixelated'
                    }}
                >
                    {state === 'victory' && (
                        <div className="absolute -top-12 w-full text-center text-yellow-400 font-pixel text-[10px] animate-bounce whitespace-nowrap">
                            COURSE CLEAR!
                        </div>
                    )}
                </motion.div>

                {/* Bowser */}
                <AnimatePresence>
                    {state === 'fighting' && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2.2, opacity: 1, x: [0, 5, -5, 0] }}
                            exit={{ scale: 0, opacity: 0, y: -150, rotate: 720 }}
                            transition={{ duration: 0.4 }}
                            className="w-24 h-24"
                        >
                            <img
                                src={ASSETS.bowser}
                                alt="Bowser"
                                className="w-full h-full object-contain pixelated"
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Question Block Interaction Effect */}
            <AnimatePresence>
                {state === 'mushroom-spawn' && (
                    <motion.div
                        initial={{ y: 0, opacity: 0, scale: 0.5 }}
                        animate={{ y: -120, opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0, scale: 2 }}
                        onAnimationComplete={onCollectMushroom}
                        className="absolute bottom-24 w-14 h-14 flex items-center justify-center bg-[#F8B800] border-4 border-black rounded-sm shadow-[inset_-4px_-4px_#B87800,inset_4px_4px_#F8F800]"
                    >
                        <span className="text-white text-xl font-bold">?</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarioSprite;
