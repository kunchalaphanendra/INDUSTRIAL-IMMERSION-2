
import React, { useEffect, useState } from 'react';
import { User, ApplicationRecord, TrackKey } from '../types';
import { apiService } from '../services/api';
import { TRACKS } from '../constants';
import { supabase } from '../lib/supabaseClient';
import ReviewForm from './ReviewForm';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onBackToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onBackToLanding }) => {
  const [enrollments, setEnrollments] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    
    // CRITICAL: Fetch current auth user to ensure we use the session email
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser?.email) {
      const data = await apiService.fetchUserEnrollments(authUser.email);
      setEnrollments(data);
    } else {
      console.warn("No authenticated email found for dashboard load.");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user.email]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast("Application ID copied");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 selection:bg-blue-500/30 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4">
            {toast}
          </div>
        )}

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

        {/* Task 2: Student Identity Card UI */}
        {!loading && enrollments.length > 0 && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.05)]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Student Industrial Identity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Application ID</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-heading font-black text-white tracking-widest uppercase">
                        {enrollments[0].application_id}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(enrollments[0].application_id)}
                        className="p-2 bg-white/5 hover:bg-blue-600/20 rounded-lg border border-white/10 transition-all text-gray-500 hover:text-blue-500"
                        title="Copy ID"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Student Name</p>
                    <p className="text-lg font-bold text-gray-200 uppercase tracking-wider">{enrollments[0].fullName}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Primary Program</p>
                    <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                      {TRACKS[enrollments[0].track_key]?.title || enrollments[0].track_key.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Payment Status</p>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-500/20">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {enrollments[0].payment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Plans Feed */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
               <h2 className="text-sm font-heading font-black tracking-[0.3em] uppercase text-gray-400">My Enrollments</h2>
             </div>
             <button onClick={loadData} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:underline transition-all">Refresh Sync</button>
          </div>
          
          {loading ? (
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
                      
                      <div className="space-y-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Active Plan
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Enrollment ID:</span>
                            <span className="text-[10px] font-heading font-black text-blue-500 uppercase tracking-widest">{record.application_id}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-3xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tighter text-white group-hover:text-blue-500 transition-colors">
                            {track?.title || record.track_key}
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/[0.03]">
                             <div className="space-y-1">
                               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Registration Date</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString()}</p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Course Progress</p>
                               {/* Fix: use course_progress instead of course_status which was renamed in ApplicationRecord interface */}
                               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{record.course_progress}</p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Payment Settlement</p>
                               <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Verified</p>
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

