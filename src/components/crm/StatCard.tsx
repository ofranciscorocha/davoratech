'use client';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="glass-premium p-6 rounded-[2rem] relative overflow-hidden group border-white/5 hover:border-premium-gold/30 transition-all duration-500"
    >
        <div className={`absolute -right-4 -bottom-4 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 ${color}`}>
            <Icon size={120} />
        </div>

        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${color} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <TrendingUp size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">{trend}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-black text-white tracking-widest leading-none">{value}</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{title}</p>
            </div>
        </div>
    </motion.div>
);
