import React from 'react';
import { motion } from 'framer-motion';

const MarioSprite = ({ state, onCollectMushroom }) => {
    // We use high-quality sprite URLs for authenticity
    const SPRITES = {
        running: 'https://raw.githubusercontent.com/Val-codemaker/mario-tasks/main/public/mario_walk.gif', // Placeholder or use CSS
        jump: 'https://img.itch.zone/aW1nLzExMTY0NjUucG5n/original/K1o1J%2B.png', // Just for visual reference in prompt
        bowser: 'https://raw.githubusercontent.com/Val-codemaker/mario-tasks/main/public/bowser.gif'
    };

    // CSS Based Mario to ensure pixel-perfect without broken URLs
    const MarioPixel = () => (
        <motion.div
            animate={state === 'running' ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="relative w-12 h-14"
        >
            {/* Representing Mario with layered pixel blocks for a "wow" retro feel */}
            <div className="absolute inset-0 bg-red-600 border-2 border-black">
                <div className="absolute top-0 left-2 w-8 h-4 bg-red-800" /> {/* Hat */}
                <div className="absolute top-4 left-4 w-6 h-4 bg-[#FFCC99]" /> {/* Face */}
                <div className="absolute bottom-0 left-0 w-full h-6 bg-blue-700" /> {/* Overalls */}
                <div className="absolute bottom-0 left-0 w-4 h-2 bg-yellow-400" /> {/* Button */}
                <div className="absolute bottom-0 right-0 w-4 h-2 bg-yellow-400" /> {/* Button */}
            </div>
        </motion.div>
    );

    return (
        <div className="relative flex items-end justify-center h-full w-full">
            <div className="flex items-end gap-20">
                <MarioPixel />

                {state === 'fighting' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5, x: [-20, 20, -20] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-20 h-20 bg-green-700 border-4 border-black relative rounded-t-3xl"
                    >
                        <div className="absolute -top-4 left-4 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                        <div className="absolute top-4 left-4 text-[8px] text-white">BOSS</div>
                    </motion.div>
                )}
            </div>

            {state === 'mushroom-spawn' && (
                <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -60, opacity: 1, scale: [1, 1.2, 1] }}
                    onAnimationComplete={onCollectMushroom}
                    className="absolute bottom-20 w-8 h-8 bg-mario-ground border-4 border-black rounded-full"
                />
            )}
        </div>
    );
};

export default MarioSprite;
