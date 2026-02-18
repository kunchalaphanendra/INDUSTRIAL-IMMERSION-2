
import React, { useState, useEffect } from 'react';
import { ApplicationRecord, CourseStatus } from '../types';
import { apiService } from '../services/api';

const AdminStudents: React.FC = () => {
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await apiService.fetchAdminApplications();
    setApps(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: CourseStatus) => {
    const res = await apiService.updateApplicationStatus(id, status);
    if (res.success) {
      setApps(prev => prev.map(a => a.id === id ? { ...a, course_status: status } : a));
    }
  };

  const exportCSV = () => {
    const headers = ['App ID', 'Name', 'Email', 'Phone', 'Track', 'Type', 'Status', 'Payment', 'Date'];
    const rows = filteredApps.map(a => [
      a.application_id,
      a.fullName,
      a.email,
      a.phone,
      a.track_key,
      a.program_type,
      a.course_status,
      a.payment_status,
      new Date(a.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `STJUFENDS_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredApps = apps.filter(a => {
    const matchesSearch = a.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          a.email.toLowerCase().includes(search.toLowerCase()) ||
                          (a.application_id && a.application_id.toLowerCase().includes(search.toLowerCase()));
    const matchesCourse = filterCourse === 'all' || a.track_key === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Student CRM</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Manage all active and historical enrollments</p>
        </div>
        <button 
          onClick={exportCSV}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 transition-all"
        >
          Export CSV Ledger
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-[#080808] p-6 rounded-[2rem] border border-white/5">
        <div className="flex-1 min-w-[240px] relative">
           <input 
             type="text" 
             placeholder="Search Name, Email or App ID..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs focus:border-blue-500 outline-none placeholder:text-gray-700 transition-all"
           />
           <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">🔍</div>
        </div>
        <select 
          value={filterCourse}
          onChange={e => setFilterCourse(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500"
        >
          <option value="all">All Tracks</option>
          <option value="college_immersion">Immersion Track</option>
          <option value="college_prof">Professional Track</option>
          <option value="school_skill">School Skill</option>
          <option value="school_tuition">School Tuition</option>
        </select>
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">App ID</th>
                <th className="px-8 py-6">Program</th>
                <th className="px-8 py-6">Course Status</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px] font-bold">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-600 uppercase tracking-widest">Accessing Registry...</td></tr>
              ) : filteredApps.map(a => (
                <tr key={a.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-white">{a.fullName}</span>
                      <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black mt-1">{a.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-blue-500 font-black tracking-[0.1em]">{a.application_id || '---'}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-gray-400 uppercase text-[9px] tracking-widest">{a.track_key.replace(/_/g, ' ')}</span>
                      <span className="text-[8px] text-gray-700 uppercase tracking-widest mt-0.5">{a.program_type?.replace(/_/g, ' ') || 'Self-Enroll'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={a.course_status || 'pending'} 
                      onChange={(e) => handleStatusChange(a.id, e.target.value as CourseStatus)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none group-hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="dropout">Dropout</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${a.payment_status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {a.payment_status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-gray-600 hover:text-white transition-all text-[8px] uppercase tracking-widest font-black">View Profile</button>
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
