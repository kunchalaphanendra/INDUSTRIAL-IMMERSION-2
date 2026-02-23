
import React, { useState, useEffect } from 'react';
import { Institution, StudentType } from '@/types';
import { apiService } from '../services/api';

const AdminInstitutions: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State for manual addition
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<StudentType>('COLLEGE');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    setLoading(true);
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

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setIsSubmitting(true);
    setFormError(null);
    
    // Logic: Admin adding is always verified=true, type saved as lowercase
    const res = await apiService.adminAddInstitution(newName.trim(), newType);
    if (res.success) {
      setIsModalOpen(false);
      setNewName('');
      await fetchInstitutions();
    } else {
      setFormError(res.error || "Failed to add institution");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Institutional Partners</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Verify and manage schools and colleges</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Add Institution
          </button>
          <button 
            onClick={fetchInstitutions} 
            disabled={loading}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            {loading ? 'Refreshing...' : 'Sync Registry'}
          </button>
        </div>
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
                  <th className="px-8 py-6">Type</th>
                  <th className="px-8 py-6">Status</th>
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
                          {inst.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {!inst.is_verified && (
                        <button
                          onClick={() => handleApprove(inst.id)}
                          className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {institutions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center text-gray-600">
                      <p className="text-[10px] font-black uppercase tracking-widest">Zero Institutional Records Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Institution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
             <div className="text-center mb-10">
                <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tighter">Add Institution</h2>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2">New Industrial Partner Entry</p>
             </div>

             {formError && (
               <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-bold text-center uppercase tracking-widest">
                 {formError}
               </div>
             )}

             <form onSubmit={handleAddInstitution} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Partner Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter school or college name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Type</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewType('SCHOOL')}
                      className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${newType === 'SCHOOL' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    >
                      School
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewType('COLLEGE')}
                      className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${newType === 'COLLEGE' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    >
                      College
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-gray-500 font-bold rounded-2xl uppercase tracking-widest text-[10px] transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                   >
                     {isSubmitting ? 'Registering...' : 'Add Institution'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstitutions;



