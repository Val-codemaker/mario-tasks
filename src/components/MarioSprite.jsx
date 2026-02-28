import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MarioSprite = ({ state, onCollectMushroom }) => {
    // states: 'running', 'fighting', 'game-over', 'mushroom-spawn'

    return (
        <div className="relative w-16 h-16">
            {/* Mario Figure (Simplified Retro Block Style for demo) */}
            <motion.div
                animate={{
                    y: state === 'running' ? [0, -4, 0] : 0,
                }}
                transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-12 h-16 bg-red-600 border-4 border-black relative"
            >
                <div className="absolute top-2 left-2 w-4 h-4 bg-orange-200 border-2 border-black"></div> {/* Face */}
                <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-700"></div> {/* Pants */}
            </motion.div>

            {/* Mushroom Pickup Animation */}
            <AnimatePresence>
                {state === 'mushroom-spawn' && (
                    <motion.div
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: -40, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onAnimationComplete={onCollectMushroom}
                        className="absolute top-0 right-[-20px] w-8 h-8 bg-mario-ground border-4 border-black rounded-full"
                    >
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bowser Encounter */}
            {state === 'fighting' && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 60, opacity: 1 }}
                    className="absolute top-0 w-24 h-24 bg-green-800 border-4 border-black"
                >
                    <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 animate-bounce"></div>
                    <span className="absolute -top-10 text-xs text-white bg-black p-1">BOWSER!</span>
                </motion.div>
            )}
        </div>
    );
};

export default MarioSprite;
