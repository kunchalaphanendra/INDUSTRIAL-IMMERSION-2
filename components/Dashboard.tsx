
import React, { useEffect, useState } from 'react';
import { User, EnrollmentRecord, TrackKey } from '../types';
import { apiService } from '../services/api';
import { TRACKS } from '../constants';
import ReviewForm from './ReviewForm';

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative">
              <img 
                src={user.avatarUrl} 
                className="w-24 h-24 rounded-3xl object-cover border border-white/10" 
                alt="Profile" 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-lg flex items-center justify-center border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-heading font-black mb-1 uppercase tracking-tight">{user.fullName}</h1>
              <p className="text-gray-600 font-bold text-sm uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
            {user.isAdmin && (
              <a href="/admin/reviews" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav-admin')); }} className="px-6 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-500 font-bold rounded-xl text-[10px] uppercase tracking-widest">Admin Control</a>
            )}
            <button onClick={onBackToLanding} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 uppercase tracking-widest text-[10px]">Home</button>
            <button onClick={onLogout} className="px-6 py-3 bg-red-600/5 hover:bg-red-600/10 text-red-500 font-bold rounded-xl transition-all border border-red-500/10 uppercase tracking-widest text-[10px]">Logout</button>
          </div>
        </div>

        {/* Active Plans Feed */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
               <h2 className="text-sm font-heading font-black tracking-[0.3em] uppercase text-gray-400">Active Subscriptions</h2>
             </div>
             <button onClick={loadData} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:underline transition-all">Refresh Sync</button>
          </div>
          
          {loading && enrollments.length === 0 ? (
            <div className="bg-[#050505] border border-white/5 p-24 rounded-[3rem] flex flex-col items-center justify-center text-gray-600">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Querying Records...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-[#050505] border border-dashed border-white/10 p-20 rounded-[3rem] flex flex-col items-center justify-center text-gray-500 text-center">
              <div className="text-5xl mb-6">📂</div>
              <h3 className="text-lg font-heading font-bold text-white mb-2 uppercase tracking-widest">No Active Plans</h3>
              <p className="max-w-xs mb-8 text-gray-600 text-xs uppercase font-bold tracking-wider">Your enrolled tracks will appear here after payment settlement.</p>
              <button onClick={onBackToLanding} className="px-8 py-4 bg-blue-600 text-white font-black rounded-xl shadow-xl uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">Browse Programs</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {enrollments.map(record => {
                const track = TRACKS[record.track_key];
                return (
                  <div key={record.id} className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="bg-[#080808] p-10 rounded-[2.5rem] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                      
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Active Plan
                          </span>
                        </div>

                        <div>
                          <h3 className="text-3xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tighter text-white group-hover:text-blue-500 transition-colors">
                            {track?.title || record.track_key}
                          </h3>
                          
                          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-white/[0.03]">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                               Registered: {new Date(record.created_at).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                               Status: Operational
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Form below each plan */}
                    <ReviewForm 
                      user={user} 
                      courseKey={record.track_key} 
                      courseTitle={track?.title || record.track_key} 
                    />
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

