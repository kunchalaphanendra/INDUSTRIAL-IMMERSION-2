
import React, { useState, useEffect } from 'react';
import { ApplicationRecord, CourseStatus, TrackKey } from '../types';
import { apiService, AdminFilterOptions } from '../services/api';

const AdminStudents: React.FC = () => {
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<AdminFilterOptions>({
    studentType: 'all',
    program: 'all',
    courseStatus: 'all',
    paymentStatus: 'all',
    search: ''
  });

  useEffect(() => {
    load();
  }, [filters]);

  const load = async () => {
    setLoading(true);
    const data = await apiService.fetchAdminApplications(filters);
    setApps(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: CourseStatus) => {
    const res = await apiService.updateApplicationStatus(id, status);
    if (res.success) {
      setApps(prev => prev.map(a => a.id === id ? { ...a, course_status: status } : a));
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Student CRM</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Manage all active and historical enrollments</p>
        </div>
      </div>

      {/* Advanced Filter Console */}
      <div className="bg-[#080808] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
             <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Search</label>
             <input 
               type="text" 
               placeholder="Name, Email, ID..." 
               value={filters.search}
               onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] focus:border-blue-500 outline-none placeholder:text-gray-700 transition-all"
             />
          </div>
          
          <div>
            <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Student Type</label>
            <select 
              value={filters.studentType}
              onChange={e => setFilters(prev => ({ ...prev, studentType: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Tiers</option>
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>

          <div>
            <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Program Track</label>
            <select 
              value={filters.program}
              onChange={e => setFilters(prev => ({ ...prev, program: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Tracks</option>
              {Object.entries(TrackKey).map(([key, val]) => (
                <option key={val} value={val}>{val.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Course Progress</label>
            <select 
              value={filters.courseStatus}
              onChange={e => setFilters(prev => ({ ...prev, courseStatus: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="on_going">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="drop_out">Dropout</option>
            </select>
          </div>

          <div>
            <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Payment</label>
            <select 
              value={filters.paymentStatus}
              onChange={e => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Payments</option>
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Identity Code</th>
                <th className="px-8 py-6">Student</th>
                <th className="px-8 py-6">Student Type</th>
                <th className="px-8 py-6">Program</th>
                <th className="px-8 py-6">Progress</th>
                <th className="px-8 py-6">Revenue</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px] font-bold">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-24 text-center text-gray-600 uppercase tracking-widest">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Accessing Industrial Registry...</span>
                  </div>
                </td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan={7} className="px-8 py-24 text-center text-gray-600 uppercase tracking-widest italic">No students matching active filters</td></tr>
              ) : apps.map(a => (
                <tr key={a.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6 text-blue-500 font-black tracking-widest font-mono">{a.application_id || '---'}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-white">{a.fullName}</span>
                      <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black mt-1">{a.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${a.student_type === 'college' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]'}`}>
                      {a.student_type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-400 uppercase text-[9px] tracking-widest">{a.track_key.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={a.course_status || 'pending'} 
                      onChange={(e) => handleStatusChange(a.id, e.target.value as CourseStatus)}
                      className="bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none group-hover:border-blue-500/50 transition-all cursor-pointer text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="on_going">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="drop_out">Dropout</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-green-500">₹{(Number(a.amount_paid) || 0).toLocaleString()}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${a.payment_status === 'completed' ? 'text-green-900' : 'text-red-500'}`}>
                        {a.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      className="text-gray-500 hover:text-white transition-all text-[8px] uppercase tracking-widest font-black border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;


