
import React, { useEffect, useState } from 'react';
import { User, EnrollmentRecord } from '../types';
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

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative group">
              <img 
                src={user.avatarUrl} 
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white/5 group-hover:border-blue-500/50 transition-all duration-500 shadow-2xl" 
                alt="Profile" 
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black shadow-lg shadow-green-500/20" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Authenticated Member</p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">{user.fullName}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onBackToLanding} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5">Landing Page</button>
            <button onClick={onLogout} className="px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-bold rounded-2xl transition-all border border-red-500/20">Sign Out</button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-heading font-bold mb-6">My Immersion Tracks</h2>
            
            {loading ? (
              <div className="glass-card p-20 rounded-3xl flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10">
                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p>Retrieving your database records...</p>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="glass-card p-20 rounded-3xl flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 text-center">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Enrollments</h3>
                <p className="max-w-xs mb-8">You haven't applied for any tracks yet. Start your journey from the main page.</p>
                <button onClick={onBackToLanding} className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20">Browse Tracks</button>
              </div>
            ) : (
              enrollments.map(record => {
                const track = TRACKS[record.track_key];
                return (
                  <div key={record.id} className="glass-card p-8 rounded-[2.5rem] border-white/10 hover:border-blue-500/20 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-blue-600/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-md border border-blue-500/20">Active</span>
                          <span className="text-gray-600 text-xs font-medium">Enrolled on {new Date(record.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-2xl font-heading font-bold mb-2 group-hover:text-blue-400 transition-colors">{track?.title || record.track_key}</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-lg">Module: Industrial Strategy & Foundational Execution</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-gray-500">Course Completion</span>
                            <span className="text-white">{record.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.5)]" style={{ width: `${record.progress}%` }} />
                          </div>
                        </div>
                      </div>
                      <button className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all">Resume Learning</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Execution Stats</h2>
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 text-xl">🔥</div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Streak</p>
                    <p className="text-xl font-bold">0 Days</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 text-xl">🏆</div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Credentials</p>
                    <p className="text-xl font-bold">{enrollments.length} Earned</p>
                  </div>
               </div>
               <div className="pt-8 border-t border-white/5">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">Upcoming Event</p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-sm font-bold mb-1">Weekly Strategy Sync</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase">Today @ 8:00 PM</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
