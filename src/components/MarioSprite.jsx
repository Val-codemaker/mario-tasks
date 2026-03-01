import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MarioSprite - Professional 16-bit Sprite Renderer
 * Handles frame animations for the 5-frame spritesheet.
 * Frames: [0: Walk1, 1: Walk2, 2: Walk3, 3: Jump, 4: Victory]
 */
const MarioSprite = ({ state, theme }) => {

    const [frame, setFrame] = useState(0);

    // Animation cycle for walking
    useEffect(() => {
        if (state === 'running') {
            const interval = setInterval(() => {
                setFrame(f => (f + 1) % 3);
            }, 100);
            return () => clearInterval(interval);
        } else if (state === 'victory') {
            setFrame(4);
        } else if (state === 'jumping') {
            setFrame(3);
        } else {
            setFrame(0);
        }
    }, [state]);

    const getMarioAsset = () => {
        if (state === 'jumping') return '/mario_jump.png';
        if (state === 'victory') return '/mario_victory.png';
        if (state === 'running') {
            return frame === 1 ? '/mario_walk1.png' : frame === 2 ? '/mario_walk2.png' : '/mario_standing.png';
        }
        return '/mario_standing.png';
    };

    const bowserAsset = '/bowser_fixed.png';

    return (
        <div className="relative flex items-end justify-center h-full w-full">
            <div className="flex items-end gap-12 sm:gap-24 relative">

                {/* PRO MARIO */}
                <motion.div
                    animate={state === 'jumping' ? { y: -80 } : { y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="relative w-24 h-24"
                    style={{
                        backgroundImage: `url(${getMarioAsset()})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        imageRendering: 'pixelated',
                    }}
                >
                    {state === 'victory' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: -20 }}
                            className="absolute -top-10 w-full text-center text-yellow-500 font-pixel text-[10px] whitespace-nowrap pixel-text-shadow"
                        >
                            COURSE CLEAR!
                        </motion.div>
                    )}
                </motion.div>

                {/* PRO BOWSER (Boss State) */}
                <AnimatePresence>
                    {state === 'fighting' && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, x: 100 }}
                            animate={{ scale: 3, opacity: 1, x: 0 }}
                            exit={{ scale: 0, opacity: 0, y: -200, rotate: 1080 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="w-24 h-24"
                        >
                            <img
                                src={bowserAsset}
                                alt="Bowser"
                                className="w-full h-full object-contain pixelated"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


            {/* FX: Mushroom Spawn */}
            <AnimatePresence>
                {state === 'mushroom-spawn' && (
                    <motion.div
                        initial={{ y: 0, opacity: 0, scale: 0 }}
                        animate={{ y: -150, opacity: 1, scale: 2 }}
                        exit={{ opacity: 0, scale: 3 }}
                        className="absolute bottom-32 w-8 h-8 flex items-center justify-center bg-red-600 border-2 border-black rounded-sm"
                    >
                        <div className="w-full h-full bg-[url('https://files.freemusicarchive.org/storage-freemusicarchive-org/images/albums/Super_Mario_World_Mushroom_-_20150917173153544.png')] bg-contain" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarioSprite;

