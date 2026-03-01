import React from 'react';
import { Star, Trophy, Target, Shield, Award, Crown } from 'lucide-react';

const sagaBadges = {
    mario: { icon: Star, color: '#F8D870', name: 'INVINCIBILITY STAR' },
    pacman: { icon: Trophy, color: '#FFFF00', name: 'GHOST HUNTER' },
    sonic: { icon: Target, color: '#0040C0', name: 'CHAOS EMERALD' },
    pokemon: { icon: Award, color: '#FF0000', name: 'GYM BADGE' },
    zelda: { icon: Shield, color: '#00A800', name: 'TRIFORCE PIECE' },
};

const BadgeDisplay = ({ completedCount, saga = 'mario' }) => {
    const badgesCount = Math.floor(completedCount / 3);
    const badgeInfo = sagaBadges[saga] || sagaBadges.mario;
    const Icon = badgeInfo.icon;

    if (badgesCount <= 0) return null;

    return (
        <div className="pro-panel overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
                <Crown size={14} className="text-[var(--theme-accent)]" />
                <h3 className="text-[10px] font-pixel opacity-70 tracking-tighter">ACHIEVEMENTS LOADED</h3>
            </div>

            <div className="flex flex-wrap gap-3">
                {Array.from({ length: badgesCount }).map((_, i) => (
                    <div
                        key={i}
                        className="relative group cursor-help"
                        title={`${badgeInfo.name} #${i + 1}`}
                    >
                        <div className="w-10 h-10 bg-black/40 border-4 border-theme-border flex items-center justify-center hover:scale-110 transition-transform">
                            <Icon
                                size={18}
                                color={badgeInfo.color}
                                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-bounce"
                                style={{ animationDuration: `${2 + i % 2}s` }}
                            />
                        </div>
                        {/* TOOLTIP (Retro style) */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--theme-border)] text-white text-[6px] py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20">
                            {badgeInfo.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-2 border-t-2 border-white/10 flex justify-between items-center">
                <span className="text-[8px] opacity-50">BONUS SCORE</span>
                <span className="text-[10px] text-[var(--theme-accent)]">+{badgesCount * 1000} PTS</span>
            </div>
        </div>
    );
};

export default BadgeDisplay;
