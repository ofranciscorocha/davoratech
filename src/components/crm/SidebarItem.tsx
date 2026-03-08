'use client';
import { motion } from 'framer-motion';

export const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative
      ${active
                ? 'text-premium-gold'
                : 'text-gray-500 hover:text-white'}`}
    >
        {active && (
            <motion.div
                layoutId="sidebar-active-bg"
                className="absolute inset-0 bg-gradient-to-r from-premium-gold/10 to-transparent rounded-2xl border-l-2 border-premium-gold"
            />
        )}
        <Icon className={`w-5 h-5 transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'group-hover:scale-110'}`} />
        <span className={`font-bold text-xs uppercase tracking-widest transition-all ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
    </button>
);
