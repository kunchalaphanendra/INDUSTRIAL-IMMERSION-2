
import React, { useEffect, useState } from 'react';
import { User, EnrollmentRecord, TrackKey } from '../types';
import { apiService } from '../services/api';
import { TRACKS } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onBackToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onBackToLanding }) => {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.fetchUserEnrollments(user.email);
      setEnrollments(data);
      setLoading(false);
    };
    loadData();
  }, [user.email]);

  const getStatusInfo = (progress: number) => {
    if (progress < 20) return { label: 'Active: Phase 1', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (progress < 50) return { label: 'Active: Phase 2', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    if (progress < 80) return { label: 'Active: Phase 3', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { label: 'Course Complete', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Command Header */}
        <div className="glass-card rounded-[3.5rem] p-10 md:p-14 border-white/10 mb-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-125 group-hover:bg-blue-500/40 transition-all duration-700" />
              <img 
                src={user.avatarUrl} 
                className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white/5 relative z-10 shadow-2xl transition-transform duration-500" 
                alt="Profile" 
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#030303] rounded-xl flex items-center justify-center border border-white/10 z-20">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-heading font-black mb-2 tracking-tighter uppercase">{user.fullName}</h1>
              <p className="text-gray-500 font-medium text-base flex items-center gap-2 justify-center md:justify-start">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
            <button onClick={onBackToLanding} className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-xs">Home</button>
            <button onClick={onLogout} className="flex-1 px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-bold rounded-2xl transition-all border border-red-500/20 uppercase tracking-widest text-xs">Logout</button>
          </div>
        </div>

        {/* Active Plans Feed */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xl font-heading font-black tracking-widest uppercase text-blue-500">Active Plans</h2>
             <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{enrollments.length} Programs Registered</div>
          </div>
          
          {loading ? (
            <div className="glass-card p-32 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 border-white/5">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="font-heading font-bold uppercase tracking-widest text-xs opacity-50">Syncing System...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="glass-card p-24 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 text-center">
              <div className="text-6xl mb-6">📥</div>
              <h3 className="text-xl font-heading font-bold text-white mb-2 uppercase">No Active Plans</h3>
              <p className="max-w-xs mb-8 text-gray-500 text-sm">You haven't enrolled in any industrial tracks yet.</p>
              <button onClick={onBackToLanding} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">Explore Tracks</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map(record => {
                const track = TRACKS[record.track_key];
                const status = getStatusInfo(record.progress);
                return (
                  <div key={record.id} className="glass-card p-8 rounded-[2.5rem] border-white/10 hover:border-blue-500/40 transition-all group">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-3 py-1 ${status.bg} ${status.color} text-[9px] font-black uppercase tracking-widest rounded-lg border border-current`}>
                            {status.label}
                          </span>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                            ID: #{record.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-heading font-bold mb-2 uppercase tracking-tight text-white group-hover:text-blue-500 transition-colors">
                          {track?.title || record.track_key}
                        </h3>
                        <div className="flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                           <span>Enrolled: {new Date(record.created_at).toLocaleDateString()}</span>
                           <span>Duration: {track?.duration || 'Ongoing'}</span>
                        </div>
                      </div>

                      <div className="w-full md:w-72">
                         <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Learning Progress</span>
                            <span className="text-lg font-heading font-bold text-white">{record.progress}%</span>
                         </div>
                         <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                              style={{ width: `${record.progress}%` }} 
                            />
                         </div>
                         <button className="w-full mt-6 py-4 bg-white text-black font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em]">Resume Module</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


