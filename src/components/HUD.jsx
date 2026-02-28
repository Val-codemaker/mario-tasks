import React from 'react';

const HUD = ({ score, coins, lives, world }) => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-4 smw-hud-text sm:text-2xl text-white pixel-text-shadow">

                {/* PLAYER & SCORE */}
                <div className="flex flex-col">
                    <span className="text-[14px] sm:text-[18px]">MARIO</span>
                    <span className="tracking-[0.2em] font-black">{score.toString().padStart(6, '0')}</span>
                </div>

                {/* COINS */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-7 bg-[#F8D870] border-[3px] border-black relative ring-2 ring-yellow-200 animate-coin">
                            <div className="absolute inset-1 border border-black/30" />
                        </div>
                        <span className="font-black text-[18px] sm:text-[24px]">x{coins.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                {/* WORLD & LIVES */}
                <div className="flex flex-col items-center justify-between h-full">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-[14px] opacity-70">WORLD</span>
                        <span className="tracking-widest font-black">{world === 'Overworld' ? '1-1' : world === 'Castle' ? '8-4' : '4-2'}</span>
                    </div>
                </div>

                {/* LIVES (Status) & TIME */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[12px] sm:text-[16px]">LIVES:</span>
                        <span className="text-red-500 font-black">{lives.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-[14px] opacity-70">TIME</span>
                        <span className="tracking-widest font-black">300</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HUD;
