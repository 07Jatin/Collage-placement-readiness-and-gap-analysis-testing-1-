import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  Target,
} from 'lucide-react';

import { SidebarItem } from './Common';
import { accountNavigation, adminNavigation, studentNavigation } from '../config/navigation';


const AppSidebar = ({
  activeTab,
  dashboardTrack,
  darkMode,
  onLogout,
  onRoleSwitch,
  setActiveTab,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  testActive,
  userRole,
}) => {
  const navItems = userRole === 'student' ? studentNavigation : adminNavigation;
  const switchMeta = accountNavigation.switchRole[userRole];

  return (
    <aside
      className={`placify-sidebar fixed z-20 flex h-full flex-col transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-72 p-6' : 'w-20 p-4'
      }`}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-8 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition-all hover:scale-110 hover:bg-sky-400 active:scale-95"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className={`mb-10 flex items-center transition-all duration-300 ${sidebarOpen ? 'space-x-3 px-2' : 'justify-center px-0'}`}>
        <div className="gradient-ocean shrink-0 rounded-2xl p-2.5 shadow-lg shadow-sky-500/20">
          <Target className="text-white" size={sidebarOpen ? 24 : 20} />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden whitespace-nowrap">
            <span className="block text-[26px] font-black tracking-tight text-slate-900 transition-colors duration-300 dark:text-white">Placify</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-sky-600 dark:text-[#79b6ff]">AI Readiness Suite</span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarOpen && (
          <div className="mb-4 px-3">
            <div className="placify-panel rounded-2xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-600 dark:text-[#79b6ff]">Workspace</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {userRole === 'admin' ? 'Institution Console' : 'Student Workspace'}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-500">{dashboardTrack}</p>
            </div>
          </div>
        )}

        {navItems.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={item.key === 'tests' ? activeTab === 'tests' || testActive : activeTab === item.key}
            onClick={() => setActiveTab(item.key)}
            collapsed={!sidebarOpen}
          />
        ))}

        <div className="mb-4 mt-6 px-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative flex w-full items-center overflow-hidden rounded-2xl border p-1 shadow-inner transition-all duration-500 ${
              darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'
            }`}
          >
            <div
              className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-xl shadow-sm transition-all duration-500 ${
                darkMode ? 'translate-x-[calc(100%+4px)] bg-slate-800' : 'translate-x-0 bg-white'
              }`}
            />
            <div className={`z-10 flex flex-1 items-center justify-center space-x-2 py-2.5 transition-all duration-300 ${!darkMode ? 'text-indigo-600' : 'text-slate-500'}`}>
              <Sun size={14} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Light</span>}
            </div>
            <div className={`z-10 flex flex-1 items-center justify-center space-x-2 py-2.5 transition-all duration-300 ${darkMode ? 'text-amber-500' : 'text-slate-400'}`}>
              <Moon size={14} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>}
            </div>
          </button>
        </div>

        {sidebarOpen && (
          <div className="pb-2 pt-4">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Role & Account</p>
          </div>
        )}
        {!sidebarOpen && <div className="border-t border-white/5 pt-4" />}

        <SidebarItem
          icon={switchMeta.icon}
          label={switchMeta.label}
          active={false}
          onClick={onRoleSwitch}
          collapsed={!sidebarOpen}
          variant="warning"
        />

        <SidebarItem
          icon={accountNavigation.profile.icon}
          label={accountNavigation.profile.label}
          active={activeTab === accountNavigation.profile.key}
          onClick={() => setActiveTab(accountNavigation.profile.key)}
          collapsed={!sidebarOpen}
        />

        <div className="pt-2" />

        <SidebarItem
          icon={LogOut}
          label="Logout"
          active={false}
          onClick={onLogout}
          collapsed={!sidebarOpen}
          variant="logout"
        />
      </nav>

      <div className="mt-auto space-y-4 border-t border-white/5 pt-8">
        <div className={`placify-panel flex items-center rounded-[20px] transition-all duration-300 ${sidebarOpen ? 'space-x-3 p-4' : 'justify-center p-3'}`}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#163D66] font-black tracking-wider text-white">
            SJ
            <div className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0F1B2E] ${userRole === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              {userRole === 'admin' ? <ShieldCheck size={8} className="text-white" /> : <GraduationCap size={8} className="text-white" />}
            </div>
          </div>
          {sidebarOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-black text-white">Sarah Johnson</p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#8EA2C5]">{userRole === 'admin' ? 'Administrator' : 'Student Workspace'}</p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <div className="placify-panel flex items-center justify-between rounded-2xl px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-600 dark:text-[#79b6ff]">Next sync</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Data refresh available</p>
            </div>
            <RefreshCw size={14} className="text-slate-500" />
          </div>
        )}
      </div>
    </aside>
  );
};


export default AppSidebar;
