import React from 'react';

export const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        title={collapsed ? label : ''}
        className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${collapsed ? 'justify-center px-0 py-3' : 'space-x-3 px-4 py-3'
            } ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon size={20} className="shrink-0" />
        {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{label}</span>}
        {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl pointer-events-none z-50">
                {label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
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
