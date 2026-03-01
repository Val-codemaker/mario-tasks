import React from 'react';

const sagaHUD = {
    mario: { label: 'MARIO', item: 'COINS', itemColor: '#F8D870' },
    pacman: { label: 'PAC-MAN', item: 'DOTS', itemColor: '#FFFF00' },
    sonic: { label: 'SONIC', item: 'RINGS', itemColor: '#F8D870' },
    pokemon: { label: 'ASH', item: 'EXP', itemColor: '#3A5DA8' },
    zelda: { label: 'LINK', item: 'RUPEES', itemColor: '#00A800' },
};

const HUD = ({ score, coins, lives, world, saga = 'mario' }) => {
    const current = sagaHUD[saga] || sagaHUD.mario;

    return (
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4 sm:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-4 sm:text-2xl text-[var(--theme-text)] pixel-text-shadow items-start">

                {/* PLAYER & SCORE */}
                <div className="flex flex-col">
                    <span className="text-[10px] sm:text-[14px] opacity-80">{current.label}</span>
                    <span className="tracking-widest font-black leading-tight text-[12px] sm:text-[20px]">{score.toString().padStart(6, '0')}</span>
                </div>

                {/* ITEMS */}
                <div className="flex flex-col items-center">
                    <span className="text-[8px] sm:text-[12px] opacity-80 mb-1">{current.item}</span>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-4 sm:w-5 sm:h-7 border-[2px] border-[var(--theme-border)] shadow-sm animate-pulse"
                            style={{ backgroundColor: current.itemColor }}
                        />
                        <span className="font-black text-[12px] sm:text-[20px]">x{coins.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                {/* WORLD/SAGA */}
                <div className="flex flex-col items-center">
                    <span className="text-[8px] sm:text-[12px] opacity-80 uppercase">World</span>
                    <span className="tracking-widest font-black text-[12px] sm:text-[20px]">{world === 'Overworld' ? '1-1' : '8-4'}</span>
                </div>

                {/* TIME/LIVES */}
                <div className="flex flex-col items-end">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] sm:text-[12px] opacity-80">TIME</span>
                        <span className="font-black text-[12px] sm:text-[20px]">300</span>
                    </div>
                </div>

            </div>
        </div>
    );
};


export default HUD;
