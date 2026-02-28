import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle, Star, Clock } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {


    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            whileHover={{ scale: 1.01 }}
            id={`task-${task.id}`}
            className={`mission-block group flex items-center justify-between ${task.completed ? 'completed' : ''}`}
        >
            <div className="flex items-center gap-6">
                {/* Custom Retro Checkbox */}
                <button
                    onClick={() => onToggle(task)}
                    className={`w-12 h-12 flex items-center justify-center border-[4px] border-black transition-all ${task.completed ? 'bg-green-600' : 'bg-white hover:bg-yellow-200'}`}
                >
                    {task.completed ? (
                        <CheckCircle className="text-white" size={24} />
                    ) : (
                        <span className="text-xl font-black">?</span>
                    )}
                </button>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        {task.priority === 'high' && <Star size={16} className="text-red-600 fill-current animate-pulse" />}
                        <span className={`text-[12px] leading-relaxed uppercase font-bold ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                        </span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <span className="text-[8px] bg-black text-white px-2 py-1">
                            WORLD: {task.category}
                        </span>
                        {task.deadline && (
                            <div className="flex items-center gap-1 text-[8px] text-black/60 font-bold">
                                <Clock size={10} />
                                {new Date(task.deadline).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 border-[3px] border-transparent hover:border-black"
                >
                    <Trash2 size={24} className="text-red-600" />
                </button>
            </div>
        </motion.div>
    );
};

export default TaskItem;
