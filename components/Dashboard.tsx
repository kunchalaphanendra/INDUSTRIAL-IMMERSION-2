
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
      // Small delay to feel "Industrial"
      const data = await apiService.fetchUserEnrollments(user.email);
      setEnrollments(data);
      setLoading(false);
    };
    loadData();
  }, [user.email]);

  const getStatusInfo = (progress: number) => {
    if (progress < 20) return { label: 'Strategic Onboarding', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (progress < 50) return { label: 'Foundational Execution', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    if (progress < 80) return { label: 'Lead Management', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { label: 'Final Certification', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Command Header */}
        <div className="glass-card rounded-[3.5rem] p-10 md:p-14 border-white/10 mb-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-125 group-hover:bg-blue-500/40 transition-all duration-700" />
              <img 
                src={user.avatarUrl} 
                className="w-36 h-36 rounded-[2.5rem] object-cover border-4 border-white/5 relative z-10 shadow-2xl transition-transform duration-500 group-hover:rotate-3" 
                alt="Profile" 
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#030303] rounded-2xl flex items-center justify-center border border-white/10 z-20">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Execution Command Level 01</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-black mb-3 tracking-tighter uppercase">{user.fullName}</h1>
              <p className="text-gray-500 font-medium text-lg flex items-center gap-2 justify-center md:justify-start">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
            <button onClick={onBackToLanding} className="flex-1 px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-xs">Landing</button>
            <button onClick={onLogout} className="flex-1 px-10 py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20 uppercase tracking-widest text-xs">Disconnect</button>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Course Feed */}
          <div className="lg:col-span-3 space-y-10">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-2xl font-heading font-black tracking-widest uppercase">Active Operations</h2>
               <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{enrollments.length} Active Tracks</div>
            </div>
            
            {loading ? (
              <div className="glass-card p-32 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="font-heading font-bold uppercase tracking-widest text-xs">Synchronizing Credentials...</p>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="glass-card p-32 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 text-center group">
                <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-500">📥</div>
                <h3 className="text-2xl font-heading font-black text-white mb-4 uppercase">System Empty</h3>
                <p className="max-w-xs mb-10 text-gray-500 leading-relaxed font-medium">You have no active industrial tracks assigned to your profile. Deploy now to start building proof.</p>
                <button onClick={onBackToLanding} className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">Initialize Deployment</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {enrollments.map(record => {
                  const track = TRACKS[record.track_key];
                  const status = getStatusInfo(record.progress);
                  return (
                    <div key={record.id} className="glass-card p-10 rounded-[3rem] border-white/10 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8">
                        <span className={`px-4 py-1.5 ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest rounded-lg border border-current opacity-70`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row gap-10">
                        {/* Course Identity */}
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-3">Enrolled Operational Track</p>
                          <h3 className="text-3xl font-heading font-black mb-4 group-hover:text-blue-500 transition-colors uppercase tracking-tighter">
                            {track?.title || record.track_key}
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                               Launched {new Date(record.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                               {track?.duration || 'Ongoing'}
                            </div>
                          </div>

                          {/* Complex Progress Bar */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Immersion Depth</span>
                                <span className="text-2xl font-heading font-black text-white">{record.progress}%</span>
                              </div>
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Syncing Deliverables...</span>
                            </div>
                            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.4)] relative" 
                                style={{ width: `${record.progress}%` }} 
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Milestone Tracker (Mini Sidebar within card) */}
                        <div className="w-full md:w-64 space-y-4 pt-4 md:pt-14 border-t md:border-t-0 md:border-l border-white/5 md:pl-8">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-6">Milestone Roadmap</p>
                           <div className="space-y-6">
                              {[
                                { name: 'Onboarding', done: record.progress > 10 },
                                { name: 'Execution Brief', done: record.progress > 30 },
                                { name: 'Lead Interaction', done: record.progress > 60 },
                                { name: 'Final Letter', done: record.progress > 95 },
                              ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 relative group/step">
                                  <div className={`w-3 h-3 rounded-sm border-2 transition-all ${step.done ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'border-white/20'}`} />
                                  <span className={`text-[11px] font-bold uppercase tracking-widest ${step.done ? 'text-white' : 'text-gray-600'}`}>{step.name}</span>
                                </div>
                              ))}
                           </div>
                           <button className="w-full mt-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] shadow-2xl">Resume Deployment</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Performance Sidebar */}
          <div className="space-y-10">
            <h2 className="text-2xl font-heading font-black tracking-widest uppercase px-2">Data Feed</h2>
            
            <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10" />
               
               <div className="text-center mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-2">Execution Score</p>
                  <div className="text-6xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600">
                    {enrollments.length > 0 ? (enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length).toFixed(0) : '00'}
                  </div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 tracking-widest">Base Integrity Point</p>
               </div>

               <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-2">Upcoming Intelligence</p>
                    <p className="text-sm font-bold text-white mb-1">Live Founder Sync</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Today @ 20:00 IST</p>
                  </div>

                  <div className="space-y-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-1">Network Activity</p>
                    {[
                      { icon: '🚀', text: 'New Project Brief Deployed', time: '2h' },
                      { icon: '🔐', text: 'Credential Key Updated', time: '5h' },
                      { icon: '👥', text: 'Mentor Feedback Logged', time: '1d' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-lg border border-white/5 group-hover:border-blue-500/20 transition-all">{item.icon}</div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">{item.text}</p>
                          <p className="text-[9px] text-gray-600 font-bold uppercase">{item.time} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Quick Action Dock */}
            <div className="glass-card p-6 rounded-[2.5rem] border-white/5 grid grid-cols-2 gap-4">
               <button className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-blue-600 transition-all group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📄</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Briefs</span>
               </button>
               <button className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-purple-600 transition-all group">
                  <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Support</span>
               </button>
               <button className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-orange-600 transition-all group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🎓</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Assets</span>
               </button>
               <button className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-green-600 transition-all group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🏆</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Letter</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

