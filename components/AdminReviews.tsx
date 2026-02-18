
import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { apiService } from '../services/api';

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const data = await apiService.fetchAllReviewsForAdmin();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    const result = await apiService.toggleReviewApproval(id, !current);
    if (result.success) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: !current } : r));
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Internal Systems</p>
            <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Review Moderation</h1>
          </div>
          <button onClick={loadAll} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Refresh feed</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6">User</th>
                    <th className="px-8 py-6">Course</th>
                    <th className="px-8 py-6">Rating</th>
                    <th className="px-8 py-6">Feedback</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <img src={r.user_avatar} className="w-8 h-8 rounded-lg" alt="" />
                          <span className="text-white text-xs font-bold">{r.user_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{r.course.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-blue-500 font-bold">{"★".repeat(r.rating)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-500 text-[11px] font-medium max-w-xs truncate">{r.review_text}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${r.is_approved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {r.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleToggle(r.id, r.is_approved)}
                          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${r.is_approved ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {r.is_approved ? 'Reject' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">No reviews found in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
