
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

  const loadData = async () => {
    setLoading(true);
    const data = await apiService.fetchUserEnrollments(user.email);
    setEnrollments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user.email]);

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 selection:bg-blue-500/30 font-sans">
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
             <div className="flex items-center gap-3">
               <h2 className="text-xl font-heading font-black tracking-widest uppercase text-white">Active Subscriptions</h2>
               <button onClick={loadData} className="p-2 hover:bg-white/5 rounded-full text-gray-600 hover:text-blue-500 transition-all" title="Sync Data">
                 <svg className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               </button>
             </div>
             <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{enrollments.length} Operational</div>
          </div>
          
          {loading && enrollments.length === 0 ? (
            <div className="glass-card p-32 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 border-white/5">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="font-heading font-bold uppercase tracking-widest text-xs opacity-50">Connecting to Database...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="glass-card p-24 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 text-center">
              <div className="text-6xl mb-6">📥</div>
              <h3 className="text-xl font-heading font-bold text-white mb-2 uppercase">No Registered Plans</h3>
              <p className="max-w-xs mb-8 text-gray-500 text-sm">Once you complete an enrollment, your active plan will appear here instantly.</p>
              <button onClick={onBackToLanding} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">Enroll Now</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map(record => {
                const track = TRACKS[record.track_key];
                return (
                  <div key={record.id} className="glass-card p-10 rounded-[3rem] border-white/10 hover:border-blue-500/40 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)]" />
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-green-500/30">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            Plan Active
                          </span>
                          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                            Ref: {record.id.slice(-8).toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-3xl font-heading font-bold mb-3 uppercase tracking-tight text-white group-hover:text-blue-500 transition-colors">
                            {track?.title || record.track_key}
                          </h3>
                          <div className="flex flex-wrap gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                             <div className="flex items-center gap-2">
                               <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                               Registered: {new Date(record.created_at).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-2">
                               <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                               Access: Full
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-72 p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                         <div className="flex justify-between items-end mb-4 px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Operational Depth</span>
                            <span className="text-xl font-heading font-black text-white">{record.progress}%</span>
                         </div>
                         <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden p-1 border border-white/5">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.4)] relative" 
                              style={{ width: `${record.progress}%` }} 
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                         </div>
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
   </div>
                         </div>
                         <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden p-1 border border-white/5">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.4)] relative" 
                              style={{ width: `${record.progress}%` }} 
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                         </div>
                         <button className="w-full mt-8 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/20">Resume Execution</button>
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



