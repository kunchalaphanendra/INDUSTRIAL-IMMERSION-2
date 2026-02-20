
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BlogPost } from '../types';

interface BlogListProps {
  onPostClick: (slug: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onPostClick }) => {
  const [posts, setPosts] = useState<Partial<BlogPost>[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [published, featured] = await Promise.all([
        apiService.fetchPublishedBlogPosts(),
        apiService.fetchFeaturedPost()
      ]);
      
      // Filter out featured post from regular list to avoid duplication
      const regularPosts = featured 
        ? published.filter(p => p.id !== featured.id)
        : published;

      setPosts(regularPosts);
      setFeaturedPost(featured);
      setIsLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
      </div>
    );
  }

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">STJUFENDS Editorial</p>
        <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter leading-none mb-6">
          Industrial <br /><span className="text-blue-500">Insights</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Deep dives into industrial immersion, career acceleration, and the future of technical education.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-20">
          <div 
            onClick={() => onPostClick(featuredPost.slug)}
            className="glass-card rounded-[3rem] border-white/10 overflow-hidden group cursor-pointer hover:border-blue-500/40 transition-all duration-700 grid grid-cols-1 lg:grid-cols-2"
          >
            <div className="aspect-video lg:aspect-auto overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <img 
                src={featuredPost.cover_image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-8 left-8 z-20">
                <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl shadow-blue-500/40">
                  Featured Insight
                </span>
              </div>
            </div>
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                  {featuredPost.category}
                </span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                  {featuredPost.reading_time} min read
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8 group-hover:text-blue-400 transition-colors leading-[1.1] tracking-tighter uppercase">
                {featuredPost.title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-6">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:translate-x-3 transition-transform duration-500">
                  Read Full Story →
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && !featuredPost ? (
        <div className="text-center py-20 glass-card rounded-[3rem] border-white/5">
          <p className="text-gray-500 font-bold uppercase tracking-widest">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id}
              onClick={() => onPostClick(post.slug || '')}
              className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                {post.cover_image ? (
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl">📝</div>
                )}
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    {post.reading_time} min read
                  </span>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    {new Date(post.published_at || post.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:translate-x-2 transition-transform duration-300">
                    Read Full Story →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
