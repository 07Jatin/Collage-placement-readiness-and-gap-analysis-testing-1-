import React from 'react';
import { RefreshCw } from 'lucide-react';


const AppTopbar = ({ dashboardTrack, selectedStudent, userRole, onRefresh }) => (
  <div className="placify-topbar mb-6 flex flex-col gap-4 rounded-[28px] px-5 py-4 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 dark:text-[#79b6ff]">Placify AI</p>
      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {userRole === 'admin' ? 'Institutional readiness monitoring' : 'Placement readiness workspace'}
      </h2>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="placify-chip rounded-2xl px-4 py-2 text-xs font-bold">{dashboardTrack}</div>
      <div className="placify-chip rounded-2xl px-4 py-2 text-xs font-bold">{selectedStudent}</div>
      <button
        onClick={onRefresh}
        className="rounded-2xl bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
      >
        <RefreshCw size={14} className="mr-2 inline-block" />
        Refresh
      </button>
    </div>
  </div>
);


export default AppTopbar;
