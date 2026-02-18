
import React, { useState, useEffect } from 'react';
import { Review, TrackKey } from '../types';
import { apiService } from '../services/api';

interface ReviewSectionProps {
  courseKey: TrackKey;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ courseKey }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await apiService.fetchApprovedReviews(courseKey);
      setReviews(data);
      setLoading(false);
    };
    loadReviews();
  }, [courseKey]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div>
          <h3 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-2">Participant Feedback</h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Verified execution reports</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="text-center md:text-right">
            <div className="text-4xl font-heading font-black text-blue-500 mb-1">{avgRating}<span className="text-gray-700 text-xl">/5.0</span></div>
            <div className="flex justify-center md:justify-end text-blue-500 text-xs mb-1">
              {"★".repeat(Math.round(Number(avgRating)))}{"☆".repeat(5 - Math.round(Number(avgRating)))}
            </div>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Based on {reviews.length} Industrial reviews</p>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="py-12 text-center text-gray-600">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No verified feedback available for this cycle yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/10 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <img src={review.user_avatar} className="w-10 h-10 rounded-full border border-white/10" alt={review.user_name} />
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{review.user_name}</h4>
                  <div className="text-blue-500 text-[10px]">{"★".repeat(review.rating)}</div>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed font-medium">"{review.review_text}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
