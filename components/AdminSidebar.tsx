
import React from 'react';
import { logoutAdmin } from '../lib/adminAuth';

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: any) => void;
  onExit: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onViewChange, onExit }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Student CRM', icon: '👥' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'reviews', label: 'Moderation', icon: '★' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = "/";
  };

  return (
    <aside className="w-72 bg-[#080808] border-r border-white/5 flex flex-col shrink-0">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-2xl shadow-blue-500/20">S</div>
          <div>
            <h1 className="brand-text text-xl uppercase text-white tracking-tighter">STJUFENDS</h1>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em]">Management Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-[0.2em] ${
              activeView === item.id 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-lg opacity-70">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all border border-transparent hover:border-red-500/20"
        >
          Exit Control Center
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

