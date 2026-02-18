import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [data, recent] = await Promise.all([
      apiService.fetchAdminStats(),
      apiService.fetchRecentActivity()
    ]);
    setStats(data);
    setActivity(recent);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
       <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Aggregating Industrial Data...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Net Revenue', val: `₹${stats?.totalRevenue.toLocaleString()}`, icon: '💰', color: 'text-green-500' },
          { label: 'Active Students', val: stats?.totalEnrollments, icon: '🎓', color: 'text-blue-500' },
          { label: 'Total Applications', val: stats?.totalApplications, icon: '📄', color: 'text-purple-500' },
          { label: 'Pending Reviews', val: stats?.pendingReviews, icon: '⚖️', color: 'text-yellow-500' },
        ].map((s, i) => (
          <div key={i} className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/20 transition-all">
             <div className="absolute top-0 right-0 p-6 text-2xl opacity-20">{s.icon}</div>
             <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">{s.label}</p>
             <h3 className={`text-3xl font-heading font-black tracking-tighter ${s.color}`}>{s.val}</h3>
             <div className="mt-4 flex items-center gap-2">
                <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-widest">Real-time sync active</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Popularity Chart - Dynamic */}
        <div className="lg:col-span-2 bg-[#080808] border border-white/5 rounded-[3rem] p-10">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-10">Enrollment Distribution</h4>
           <div className="space-y-8">
              {stats?.distribution?.map((c: any, i: number) => {
                const colors = ['bg-blue-600', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                       <span>{c.name}</span>
                       <span className="text-white">{c.raw} Students ({c.count}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${colors[i % colors.length]} transition-all duration-1000 ease-out`} 
                         style={{ width: `${c.count}%` }}
                       />
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Recent Activity - Dynamic */}
        <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10">
           <div className="flex justify-between items-center mb-8">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">System Activity</h4>
             <button onClick={loadAll} className="text-[8px] text-blue-500 font-bold uppercase hover:underline">Sync</button>
           </div>
           <div className="space-y-6">
              {activity.length === 0 ? (
                <p className="text-[10px] text-gray-700 uppercase tracking-widest text-center py-10">No recent events</p>
              ) : activity.map((a, i) => (
                <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/[0.03] last:border-0">
                   <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === 'rev' ? 'bg-yellow-500' : 'bg-blue-600'}`} />
                   <div>
                      <p className="text-[11px] font-bold text-white uppercase tracking-widest">{a.msg}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">{a.user} • {formatTime(a.time)}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
