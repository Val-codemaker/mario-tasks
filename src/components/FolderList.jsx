import React, { useState } from 'react';
import { Folder, FolderPlus, Hash, ChevronRight } from 'lucide-react';

const FolderList = ({ folders, activeFolder, onSelect, onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newFolder, setNewFolder] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newFolder.trim()) {
            onAdd(newFolder.trim().toUpperCase());
            setNewFolder('');
            setIsAdding(false);
        }
    };

    return (
        <div className="pro-panel">
            <div className="flex items-center justify-between mb-4 border-b-4 border-theme-border pb-2">
                <h2 className="text-[10px] opacity-70 flex items-center gap-2">
                    <Folder size={14} /> FOLDERS
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="hover:scale-110 transition-transform"
                >
                    <FolderPlus size={16} />
                </button>
            </div>

            <div className="space-y-1">
                {folders.map(f => (
                    <button
                        key={f}
                        onClick={() => onSelect(f)}
                        className={`w-full text-left p-2 flex items-center justify-between group transition-all border-2 ${activeFolder === f
                            ? 'bg-[var(--theme-accent)] border-[var(--theme-border)] text-black'
                            : 'border-transparent hover:bg-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-pixel">[{f}]</span>
                        </div>
                        {activeFolder === f && <ChevronRight size={12} className="animate-pulse" />}
                    </button>
                ))}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <input
                        autoFocus
                        type="text"
                        value={newFolder}
                        onChange={(e) => setNewFolder(e.target.value)}
                        placeholder="NEW FOLDER..."
                        className="w-full bg-transparent border-4 border-[var(--theme-border)] p-2 font-pixel text-[8px] outline-none"
                    />
                    <div className="flex gap-2 mt-2">
                        <button type="submit" className="pro-button text-[8px] py-1 flex-1">CREATE</button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="pro-button-secondary text-[8px] py-1 flex-1"
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default FolderList;
