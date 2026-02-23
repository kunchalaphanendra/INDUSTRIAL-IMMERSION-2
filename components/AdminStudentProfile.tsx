
import React, { useState, useEffect } from 'react';
import { ApplicationRecord } from '@/types';
import { apiService } from '../services/api';

interface AdminStudentProfileProps {
  id: string;
  onBack: () => void;
}

const AdminStudentProfile: React.FC<AdminStudentProfileProps> = ({ id, onBack }) => {
  const [data, setData] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const record = await apiService.fetchApplicationById(id);
      setData(record);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Retrieving Profile...</p>
    </div>
  );

  if (!data) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-bold uppercase tracking-widest">Student Not Found</p>
      <button onClick={onBack} className="mt-4 text-blue-500 hover:underline uppercase text-[10px] font-black">Return to CRM</button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-tighter">Student Profile</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">Industrial Identity: {data.application_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Snapshot */}
        <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`} className="w-32 h-32 rounded-[2rem] border border-white/10 shadow-2xl" alt="" />
            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${data.student_type === 'COLLEGE' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-purple-600 border-purple-500 text-white'}`}>
              {data.student_type}
            </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{data.fullName}</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">{data.email}</p>
          
          <div className="w-full pt-8 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Progress</span>
              <span className="text-blue-500">{data.course_progress}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Program Fee</span>
              <span className="text-green-500">₹{data.amount_paid.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Detailed Data */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">Verification Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { label: 'Full Legal Name', val: data.fullName },
                  { label: 'Institution / School', val: data.institutions?.name || 'Not assigned' },
                  { label: 'Contact Sequence', val: data.phone },
                  { label: 'Educational Tier', val: data.student_type },
                  { label: 'Assigned Track', val: data.track_key.replace(/_/g, ' ').toUpperCase() },
                  { label: 'Current Context', val: data.currentStatus || 'Not Specified' },
                  { label: 'LinkedIn Digital ID', val: data.linkedin || 'None Provided' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.label}</p>
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{item.val}</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6">Industrial Objectives</h3>
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                 <p className="text-sm text-gray-400 leading-relaxed italic">"{data.careerGoals}"</p>
              </div>
           </div>

           <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">Payment Gateway Handshake</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Razorpay Payment ID</span>
                    <code className="text-[10px] text-blue-400 font-mono">{data.razorpay_payment_id || 'LOCAL_SETTLEMENT'}</code>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Transaction Signature</span>
                    <code className="text-[8px] text-gray-600 font-mono max-w-[200px] truncate">{data.id}</code>
                 </div>
                 <div className="flex justify-between items-center py-4">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">System Timestamp</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(data.created_at).toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentProfile;




