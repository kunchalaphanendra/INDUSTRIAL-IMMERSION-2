
import React, { useState, useEffect } from 'react';
import { ApplicationRecord, CourseStatus, StudentType, TrackKey } from '../types';
import { apiService } from '../services/api';

const AdminStudents: React.FC = () => {
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<ApplicationRecord | null>(null);

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

  const filteredApps = apps.filter(a => {
    const matchesSearch = a.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          a.email.toLowerCase().includes(search.toLowerCase()) ||
                          (a.application_id && a.application_id.toLowerCase().includes(search.toLowerCase()));
    const matchesCourse = filterCourse === 'all' || a.track_key === filterCourse;
    const matchesType = filterType === 'all' || a.student_type === filterType;
    return matchesSearch && matchesCourse && matchesType;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Student CRM</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Manage all active and historical enrollments</p>
        </div>
      </div>

      {/* Combined Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#080808] p-6 rounded-[2rem] border border-white/5">
        <div className="relative">
           <input 
             type="text" 
             placeholder="Search Identity..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs focus:border-blue-500 outline-none placeholder:text-gray-700 transition-all"
           />
        </div>
        
        <select 
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#080808] border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500"
        >
          <option value="all">All Students</option>
          <option value="school">School Students</option>
          <option value="college">College Students</option>
        </select>

        <select 
          value={filterCourse}
          onChange={e => setFilterCourse(e.target.value)}
          className="bg-[#080808] border border-white/10 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500"
        >
          <option value="all">All Tracks</option>
          {Object.entries(TrackKey).map(([key, val]) => (
            <option key={val} value={val}>{val.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Student Type</th>
                <th className="px-8 py-6">Program</th>
                <th className="px-8 py-6">Course Status</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px] font-bold">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-20 text-center text-gray-600 uppercase tracking-widest">Accessing Registry...</td></tr>
              ) : filteredApps.map(a => (
                <tr key={a.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6 text-blue-500 font-black tracking-widest">{a.application_id || '---'}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-white">{a.fullName}</span>
                      <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black mt-1">{a.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${a.student_type === 'college' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}`}>
                      {a.student_type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-400 uppercase text-[9px] tracking-widest">{a.track_key.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-8 py-6">
                    {a.student_type === 'college' ? (
                      <select 
                        value={a.course_status || 'pending'} 
                        onChange={(e) => handleStatusChange(a.id, e.target.value as CourseStatus)}
                        className="bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none group-hover:border-blue-500/50 transition-all cursor-pointer text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="on_going">On Going</option>
                        <option value="completed">Completed</option>
                        <option value="drop_out">Drop Out</option>
                      </select>
                    ) : (
                      <span className="text-gray-700 tracking-widest">—</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${a.payment_status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {a.payment_status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedStudent(a)}
                      className="text-blue-500 hover:text-white transition-all text-[8px] uppercase tracking-widest font-black border border-blue-500/20 px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      View Profile
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

