import React from 'react';

const HUD = ({ score, coins, world }) => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
            <div className="max-w-5xl mx-auto px-8 py-6 grid grid-cols-4 smw-hud-text sm:text-xl">
                <div className="flex flex-col">
                    <span>MARIO</span>
                    <span className="tracking-widest">{score.toString().padStart(6, '0')}</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-6 bg-[#F8D870] border-2 border-black relative animate-bounce">
                            <div className="absolute inset-1 border border-black/20" />
                        </div>
                        <span className="text-white">x {coins.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span>WORLD</span>
                    <span className="tracking-widest">1-1</span>
                </div>

                <div className="flex flex-col items-end">
                    <span>TIME</span>
                    <span className="tracking-widest">300</span>
                </div>
            </div>
        </div>
    );
};

export default HUD;
