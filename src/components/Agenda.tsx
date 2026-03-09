'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    text: string;
    completed: boolean;
    date: string;
}

export function Agenda() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskText, setNewTaskText] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('rocha_agenda');
        if (saved) {
            setTasks(JSON.parse(saved));
        }
    }, []);

    const saveTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        localStorage.setItem('rocha_agenda', JSON.stringify(newTasks));
    };

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        const newTasks = [
            ...tasks,
            {
                id: crypto.randomUUID(),
                text: newTaskText.trim(),
                completed: false,
                date: new Date().toISOString().split('T')[0]
            }
        ];
        saveTasks(newTasks);
        setNewTaskText('');
    };

    const toggleTask = (id: string) => {
        const newTasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTasks(newTasks);
    };

    const removeTask = (id: string) => {
        saveTasks(tasks.filter(t => t.id !== id));
    };

    const todayDate = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.date === todayDate);

    return (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gold/10 text-gold">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Agenda do Dia</h2>
                        <p className="text-slate-400 text-sm">Registre e acompanhe seus ajustes e aprimoramentos.</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Hoje</span>
                    <span className="font-bold text-gold">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
            </div>

            <form onSubmit={addTask} className="mb-6 relative group">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gold transition-colors" />
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Adicionar um novo aprimoramento ou ajuste..."
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 text-sm transition-all text-white placeholder:text-slate-600 font-medium"
                />
            </form>

            <div className="space-y-2">
                {todayTasks.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm italic">
                        Nenhum ajuste programado para hoje.
                    </div>
                ) : (
                    <AnimatePresence>
                        {todayTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "group flex items-center justify-between p-4 rounded-xl border transition-all",
                                    task.completed
                                        ? "bg-slate-900/30 border-white/5 opacity-60"
                                        : "bg-slate-800/40 border-white/10 hover:border-white/20"
                                )}
                            >
                                <div
                                    className="flex items-center gap-4 flex-1 cursor-pointer"
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-500 group-hover:text-gold transition-colors" />
                                    )}
                                    <span className={cn(
                                        "font-medium transition-all text-sm",
                                        task.completed ? "line-through text-slate-500" : "text-slate-200"
                                    )}>
                                        {task.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
