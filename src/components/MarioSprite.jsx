import React from 'react';
import { motion } from 'framer-motion';

const MarioSprite = ({ state, onCollectMushroom }) => {
    // Use the newly generated high-quality assets
    const ASSETS = {
        mario: '/mario_sprites.png',
        bowser: '/bowser.png',
        mushroom: '/mario_walk.gif' // Keeping previous for small items or using CSS
    };

    const getMarioStyle = () => {
        switch (state) {
            case 'jumping':
                return { scale: 1.2, y: -20 };
            case 'fighting':
                return { x: [0, 10, 0], scale: 1.1 };
            case 'victory':
                return { scale: 1.5, rotate: [0, 10, -10, 0] };
            default:
                return { x: [0, 5, 0] };
        }
    };

    return (
        <div className="relative flex items-end justify-center h-full w-full">
            <div className="flex items-end gap-16 relative">

                {/* Mario Pixel Art */}
                <motion.div
                    animate={getMarioStyle()}
                    transition={{ duration: 0.5, repeat: state === 'victory' ? 0 : Infinity }}
                    className="relative w-20 h-24 overflow-hidden"
                >
                    <img
                        src={ASSETS.mario}
                        alt="Mario"
                        className="w-full h-full object-contain pixelated"
                    />
                    {state === 'victory' && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: -40 }}
                            className="absolute top-0 left-0 w-full text-center text-yellow-400 font-pixel text-[10px]"
                        >
                            COURSE CLEAR!
                        </motion.div>
                    )}
                </motion.div>

                {/* Bowser / Boss */}
                {state === 'fighting' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.8, x: [0, 5, -5, 0] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                        className="w-32 h-32"
                    >
                        <img
                            src={ASSETS.bowser}
                            alt="Bowser"
                            className="w-full h-full object-contain pixelated"
                        />
                    </motion.div>
                )}

                {/* Vanishing Bowser after defeat */}
                {state === 'victory' && (
                    <motion.div
                        initial={{ opacity: 1, scale: 1.8 }}
                        animate={{ opacity: 0, scale: 2.5, y: -100, rotate: 360 }}
                        transition={{ duration: 1 }}
                        className="w-32 h-32 absolute right-[-100px]"
                    >
                        <img
                            src={ASSETS.bowser}
                            alt="Bowser Defeated"
                            className="w-full h-full object-contain pixelated grayscale"
                        />
                    </motion.div>
                )}
            </div>

            {state === 'mushroom-spawn' && (
                <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -80, opacity: 1 }}
                    onAnimationComplete={onCollectMushroom}
                    className="absolute bottom-20 w-10 h-10 bg-mario-ground border-4 border-black rounded-full flex items-center justify-center"
                >
                    <div className="w-4 h-4 bg-white rounded-full opacity-50" />
                </motion.div>
            )}
        </div>
    );
};

export default MarioSprite;
