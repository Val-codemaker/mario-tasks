import React from 'react';

const HUD = ({ score, coins, world }) => {
    return (
        <div className="flex justify-between items-start w-full px-8 py-4 text-white uppercase tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col">
                <span>Mario</span>
                <span className="mt-1">{score.toString().padStart(6, '0')}</span>
            </div>

            <div className="flex flex-col items-center">
                <div className="flex items-center">
                    <div className="w-4 h-5 bg-mario-coin border-2 border-black mr-2 animate-pulse"></div>
                    <span>x {coins.toString().padStart(2, '0')}</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span>World</span>
                <span className="mt-1">{world}</span>
            </div>

            <div className="flex flex-col items-end">
                <span>Time</span>
                <span className="mt-1">300</span>
            </div>
        </div>
    );
};

export default HUD;
