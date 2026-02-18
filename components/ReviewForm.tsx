
import React, { useState, useEffect } from 'react';
import { User, Review, TrackKey } from '../types';
import { apiService } from '../services/api';

interface ReviewFormProps {
  user: User;
  courseKey: TrackKey;
  courseTitle: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ user, courseKey, courseTitle }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  useEffect(() => {
    const checkExisting = async () => {
      const review = await apiService.fetchUserReview(user.id, courseKey);
      if (review) {
        setExistingReview(review);
        setRating(review.rating);
        setReviewText(review.review_text);
      }
    };
    checkExisting();
  }, [user.id, courseKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.length < 10) {
      setMessage({ type: 'error', text: 'Please provide a more detailed review (min 10 chars).' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result = await apiService.upsertReview({
      user_id: user.id,
      user_name: user.fullName,
      user_avatar: user.avatarUrl,
      course: courseKey,
      rating,
      review_text: reviewText,
      is_approved: false // Always reset to false for re-moderation on edit
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Review submitted for moderation. Thank you!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to submit review.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </div>
      
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Immersion Feedback</h4>
      <h3 className="text-xl font-heading font-bold mb-6 uppercase text-white">Reviewing: {courseTitle}</h3>
      
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Industrial Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-all ${star <= rating ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] scale-110' : 'text-gray-700 hover:text-gray-500'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Your Experience Letter</label>
          <textarea
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-blue-500 outline-none resize-none min-h-[120px]"
            placeholder="Share your execution journey and key takeaways..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 active:scale-95"
        >
          {isSubmitting ? 'Syncing...' : (existingReview ? 'Update Industrial Review' : 'Publish Feedback')}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
