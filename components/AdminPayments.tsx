
import React, { useState, useEffect } from 'react';
import { ApplicationRecord } from '../types';
import { apiService } from '../services/api';

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await apiService.fetchAdminApplications();
    setPayments(data.filter(a => a.payment_status === 'completed'));
    setLoading(false);
  };

  const totalRevenue = payments.reduce((sum, a) => sum + (a.track_key.includes('college') ? 14999 : 999), 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Finance Ledger</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Verified transaction processing records</p>
        </div>
        <div className="bg-[#080808] border border-white/5 p-6 rounded-[2rem] text-right">
           <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Verified Revenue</p>
           <h3 className="text-3xl font-heading font-black text-green-500 tracking-tighter">₹{totalRevenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Transaction Date</th>
                <th className="px-8 py-6">Student</th>
                <th className="px-8 py-6">Razorpay ID</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Track</th>
                <th className="px-8 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px] font-bold">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-600 uppercase tracking-widest">Querying Banking Gateway...</td></tr>
              ) : payments.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6 text-gray-500 font-mono text-[10px]">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-white">{p.fullName}</span>
                      <span className="text-[8px] text-gray-600 uppercase font-black">{p.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[9px] text-blue-500/70 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                      {p.razorpay_payment_id || 'LOCAL_OVERRIDE'}
                    </code>
                  </td>
                  <td className="px-8 py-6 text-green-500">
                    ₹{(p.track_key.includes('college') ? 14999 : 999).toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-[9px] uppercase text-gray-400 tracking-widest">
                    {p.track_key.replace(/_/g, ' ')}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-end gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Verified
                    </span>
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

export default AdminPayments;
