
import React, { useState, useEffect } from 'react';
import { Review } from '@/types';
import { apiService } from '../services/api';

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    // ADMIN PANEL: Fetch ALL reviews (no filtering)
    const result = await apiService.fetchAllReviewsForAdmin();
    
    if (result.error) {
      setError(result.error);
    } else {
      setReviews(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApproveReview = async (reviewId: string) => {
    try {
      const res = await apiService.approveReview(reviewId);
      if (res.success) {
        // Refresh list from DB
        await fetchReviews();
      } else {
        alert("Failed to approve review.");
      }
    } catch (err: any) {
      console.error("Approve error:", err);
      alert("System error during approval.");
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      const result = await apiService.rejectReview(reviewId);
      if (result.success) {
        // Refresh list from DB
        await fetchReviews();
      } else {
        alert(`Rejection Failed: ${result.error}`);
      }
    } catch (err: any) {
      console.error("Rejection error:", err);
      alert("System error during rejection.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'pending':
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-white uppercase tracking-tighter">Moderation Console</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Manage participant feedback and visibility</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchReviews} 
            disabled={loading}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Force Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-4">
          <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="mb-1">DATABASE SYNC ERROR</p>
            <p className="opacity-70 normal-case font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Accessing Industrial Database...</p>
        </div>
      ) : (
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <tr>
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6">Immersion Track</th>
                  <th className="px-8 py-6">Industrial Rating</th>
                  <th className="px-8 py-6">Execution Summary</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img src={r.user_avatar} className="w-9 h-9 rounded-xl border border-white/10 shadow-lg" alt="" />
                        <div className="flex flex-col">
                          <span className="text-white text-xs font-bold">{r.user_name}</span>
                          <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-0.5">ID: {r.user_id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {r.course.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-blue-500 font-bold tracking-widest">{"★".repeat(r.rating)}<span className="text-gray-800">{"☆".repeat(5-r.rating)}</span></span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-gray-500 text-[11px] font-medium max-w-xs truncate group-hover:text-gray-400 transition-colors" title={r.review_text}>{r.review_text}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(r.review_status)}`}>
                        {r.review_status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button
                        onClick={() => handleRejectReview(r.id)}
                        disabled={r.review_status === 'rejected'}
                        className={`px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${r.review_status === 'rejected' ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveReview(r.id)}
                        disabled={r.review_status === 'approved'}
                        className={`px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all ${r.review_status === 'approved' ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center text-gray-600">
                      <div className="flex flex-col items-center justify-center">
                         <div className="text-4xl mb-4 opacity-20">🗄️</div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Zero Records in Moderation Queue</p>
                      </div>
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

export default AdminReviews;







