
import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { apiService } from '../services/api';

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await apiService.fetchApprovedReviews();
      setReviews(data.slice(0, 3));
      setLoading(false);
    };
    load();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Industrial Proof</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 uppercase tracking-tight text-white">Execution Reports</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] relative group hover:border-blue-500/20 transition-all duration-500">
              <div className="text-blue-500 text-xl mb-6">{"★".repeat(r.rating)}</div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">"{r.review_text}"</p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <img src={r.user_avatar} className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all" alt="" />
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{r.user_name}</h4>
                  <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{r.course.replace(/_/g, ' ')} Participant</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
