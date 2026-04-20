import React from 'react';

export const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        title={collapsed ? label : ''}
        className={`w-full flex items-center rounded-2xl transition-all duration-300 group relative ${collapsed ? 'justify-center px-0 py-4' : 'space-x-4 px-6 py-4'
            } ${active 
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                : 'text-slate-400/60 hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
    >
        <div className={`transition-all duration-300 ${active ? 'text-indigo-400 scale-110' : 'group-hover:text-indigo-400'}`}>
            <Icon size={22} className="shrink-0" />
        </div>
        {!collapsed && (
            <span className={`text-sm tracking-wide transition-all duration-300 ${active ? 'font-black' : 'font-medium group-hover:font-semibold'}`}>
                {label}
            </span>
        )}
        {active && !collapsed && (
            <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        )}
        {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl pointer-events-none z-50 border border-white/5">
                {label}
            </div>
        )}
    </button>
);

export const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
    const gradientMap = {
        indigo: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        blue: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        amber: 'bg-gradient-to-br from-amber-400 to-orange-500',
        emerald: 'bg-gradient-to-br from-emerald-400 to-teal-500',
        rose: 'bg-gradient-to-br from-pink-500 to-rose-500'
    };

    return (
        <div className="stat-card-indigo p-6 rounded-[2rem] flex items-start justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
                <p className="text-sm font-bold mb-1 opacity-60">{title}</p>
                <h3 className="text-2xl font-black">{value}</h3>
                {subtext && <p className="text-xs mt-1 font-medium opacity-50">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl text-white shadow-lg ${gradientMap[color] || 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                <Icon size={24} />
            </div>
        </div>
    );
};
