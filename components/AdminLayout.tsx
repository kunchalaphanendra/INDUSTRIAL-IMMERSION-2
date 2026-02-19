
import React, { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { apiService } from '../services/api';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
  onExit: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeView, onViewChange, onExit }) => {
  /**
   * CRITICAL: Admin route protection.
   * Ensures only admin@stjufends.com can render the management suite.
   */
  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await apiService.checkAdminAccess();
      if (!isAdmin) {
        console.warn("Unauthorized admin access attempt blocked.");
        window.location.href = "/";
      }
    };
    verifyAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] flex font-sans">
      <AdminSidebar activeView={activeView} onViewChange={onViewChange} onExit={onExit} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">System Mode: Operational Console</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
               <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Admin Access</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

