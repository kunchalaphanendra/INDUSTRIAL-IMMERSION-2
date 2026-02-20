
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BlogPost } from '../types';

interface BlogPostDetailProps {
  slug: string;
  onBack: () => void;
  onPostClick: (slug: string) => void;
  onApplyClick: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug, onBack, onPostClick, onApplyClick }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Partial<BlogPost>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const data = await apiService.fetchBlogPostBySlug(slug);
      if (data) {
        setPost(data);
        // SEO Optimization
        document.title = `${data.meta_title || data.title} | STJUFENDS`;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', data.meta_description || data.excerpt);

        // Update keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', data.keywords);

        const related = await apiService.fetchRelatedPosts(slug);
        setRelatedPosts(related);
      }
      setIsLoading(false);
      window.scrollTo(0, 0);
    };
    loadPost();

    return () => {
      document.title = 'STJUFENDS | Industrial Immersion';
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
        <button onClick={onBack} className="text-blue-500 font-bold uppercase tracking-widest text-xs">← Back to Blog</button>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-12 flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
      >
        <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">←</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Insights</span>
      </button>

      <article>
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
              {post.author}
            </span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter leading-[0.9] mb-12">
            {post.title}
          </h1>
          {post.cover_image && (
            <div className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl shadow-blue-500/5">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        <div 
          className="prose prose-invert prose-blue max-w-none mb-24"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Block */}
        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-blue-500/20 relative overflow-hidden group mb-24">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-50" />
          <div className="relative z-10 text-center">
            <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Take the next step</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-10 uppercase tracking-tighter leading-none">
              Ready to <br /><span className="text-blue-500">Accelerate?</span>
            </h2>
            <button 
              onClick={onApplyClick}
              className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm active:scale-95"
            >
              Apply for Immersion
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-white/5 pt-24">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-500 mb-12 text-center">Related Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <div 
                  key={rp.id}
                  onClick={() => onPostClick(rp.slug)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video rounded-3xl overflow-hidden mb-6 border border-white/5">
                    <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {rp.title}
                  </h4>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogPostDetail;
