import React from 'react';

export const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed, variant }) => {
    const isLogout  = variant === 'logout';
    const isWarning = variant === 'warning';

    /* ── colour tokens ── */
    const baseRow = active
        ? 'bg-gradient-to-r from-[#1D4ED8] to-[#53B2FF] text-white shadow-[0_4px_24px_rgba(88,166,255,0.30)]'
        : isLogout
            ? 'bg-[#0F1B2E] text-[#FF718E] hover:bg-[#1a0e14] hover:text-rose-300'
            : isWarning
                ? 'bg-[#0F1B2E] text-amber-300/80 hover:bg-amber-400/10 hover:text-amber-200'
                : 'bg-[#0F1B2E] text-[#C9D7EE] hover:bg-[#162237] hover:text-white';

    const iconRing = active
        ? 'bg-white/20'
        : isLogout
            ? 'bg-[#1f0f16]'
            : 'bg-[#182C4A]';

    const iconColor = active
        ? 'text-white'
        : isLogout
            ? 'text-[#FF718E]'
            : isWarning
                ? 'text-amber-300'
                : 'text-[#89A2C8] group-hover:text-[#79B6FF]';

    return (
        <button
            onClick={onClick}
            title={collapsed ? label : ''}
            className={`
                w-full flex items-center rounded-[20px] transition-all duration-200 group relative
                ${collapsed ? 'justify-center p-3' : 'px-4 py-[14px] space-x-3'}
                ${baseRow}
            `}
        >
            {/* Left active accent bar */}
            {active && !collapsed && (
                <span className="absolute left-0 top-2 bottom-2 w-[5px] rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            )}

            {/* Icon circle */}
            <span className={`shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-200 ${iconRing}`}>
                <Icon size={15} className={`shrink-0 transition-colors duration-200 ${iconColor}`} />
            </span>

            {/* Label */}
            {!collapsed && (
                <span className={`text-[15px] leading-none transition-all duration-200 ${active ? 'font-extrabold' : 'font-semibold'}`}>
                    {label}
                </span>
            )}

            {/* Collapsed tooltip */}
            {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-[#0d1728]/95 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl pointer-events-none z-50 border border-white/5 whitespace-nowrap">
                    {label}
                </div>
            )}

            {/* Warning pulse dot */}
            {isWarning && !collapsed && (
                <span className="absolute right-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            )}
        </button>
    );
};

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
