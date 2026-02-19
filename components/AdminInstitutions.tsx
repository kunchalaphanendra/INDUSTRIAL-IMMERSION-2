
import React, { useState, useEffect } from 'react';
import { Institution } from '../types';
import { apiService } from '../services/api';

const AdminInstitutions: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    setLoading(true);
    setError(null);
    const result = await apiService.fetchAllInstitutionsForAdmin();
    setInstitutions(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await apiService.approveInstitution(id);
    if (res.success) {
      await fetchInstitutions();
    } else {
      alert("Verification failed: " + res.error);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Institutional Partners</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Verify and manage schools and colleges</p>
        </div>
        <button 
          onClick={fetchInstitutions} 
          disabled={loading}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          {loading ? 'Refreshing...' : 'Sync Registry'}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Accessing Institutional Database...</p>
        </div>
      ) : (
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <tr>
                  <th className="px-8 py-6">Institution Name</th>
                  <th className="px-8 py-6">Tier</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Added On</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-white text-xs font-black uppercase tracking-widest">
                        {inst.name}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${inst.type === 'COLLEGE' ? 'bg-blue-600/10 text-blue-500' : 'bg-purple-600/10 text-purple-500'}`}>
                        {inst.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${inst.is_verified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inst.is_verified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {inst.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {new Date(inst.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {!inst.is_verified && (
                        <button
                          onClick={() => handleApprove(inst.id)}
                          className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                          Approve Partner
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {institutions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center text-gray-600">
                      <p className="text-[10px] font-black uppercase tracking-widest">Zero Institutional Records Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstitutions;
