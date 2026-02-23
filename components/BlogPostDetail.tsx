
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BlogPost } from '@/types';

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
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const data = await apiService.fetchBlogPostBySlug(slug);
      if (data) {
        setPost(data);
        
        // SEO Optimization
        document.title = `${data.meta_title || data.title} | STJUFENDS`;
        
        // Canonical Link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', data.canonical_url || `${window.location.origin}/blog/${data.slug}`);

        // Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', data.meta_description || data.excerpt);

        // OG Tags
        const ogTags = [
          { property: 'og:title', content: data.og_title || data.meta_title || data.title },
          { property: 'og:description', content: data.og_description || data.meta_description || data.excerpt },
          { property: 'og:image', content: data.og_image || data.cover_image },
          { property: 'og:type', content: 'article' }
        ];

        ogTags.forEach(tag => {
          let el = document.querySelector(`meta[property="${tag.property}"]`);
          if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', tag.property);
            document.head.appendChild(el);
          }
          el.setAttribute('content', tag.content || '');
        });

        // Schema Markup
        const schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.meta_description || data.excerpt,
          "image": data.cover_image,
          "author": {
            "@type": "Organization",
            "name": "STJUFENDS"
          },
          "publisher": {
            "@type": "Organization",
            "name": "STJUFENDS",
            "logo": {
              "@type": "ImageObject",
              "url": "https://stjufends.com/logo.png" // Placeholder
            }
          },
          "datePublished": data.published_at || data.created_at,
          "dateModified": data.updated_at || data.created_at
        };

        let schemaScript = document.getElementById('blog-schema');
        if (!schemaScript) {
          schemaScript = document.createElement('script');
          schemaScript.id = 'blog-schema';
          schemaScript.setAttribute('type', 'application/ld+json');
          document.head.appendChild(schemaScript);
        }
        schemaScript.innerHTML = JSON.stringify(schema);

        // Parse TOC
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, 'text/html');
        const headings = Array.from(doc.querySelectorAll('h2, h3'));
        const tocItems = headings.map((h, i) => {
          const id = h.id || `heading-${i}`;
          h.id = id;
          return {
            id,
            text: h.textContent || '',
            level: parseInt(h.tagName.substring(1))
          };
        });
        setToc(tocItems);

        const related = await apiService.fetchRelatedPosts(data.id, data.category);
        setRelatedPosts(related);
      }
      setIsLoading(false);
      window.scrollTo(0, 0);
    };
    loadPost();

    return () => {
      document.title = 'STJUFENDS | Industrial Immersion';
      const schemaScript = document.getElementById('blog-schema');
      if (schemaScript) schemaScript.remove();
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
    <div className="py-24 px-4 max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-12 flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
      >
        <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">←</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Insights</span>
      </button>

      <article className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
        <div>
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                {post.category}
              </span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                {post.reading_time} min read
              </span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              {post.updated_at && post.updated_at !== post.published_at && post.updated_at !== post.created_at && (
                <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.4em]">
                  Updated: {new Date(post.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter leading-[0.9] mb-12">
              {post.title}
            </h1>
            {post.cover_image && (
              <div className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl shadow-blue-500/5">
                <img src={post.cover_image} alt={post.image_alt_text || post.title} className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          {/* Mobile TOC */}
          {toc.length > 0 && (
            <div className="lg:hidden glass-card p-8 rounded-3xl border-white/5 mb-12">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4">On this page</h3>
              <nav className="space-y-2">
                {toc.map(item => (
                  <a 
                    key={item.id} 
                    href={`#${item.id}`}
                    className={`block text-sm text-gray-400 hover:text-white transition-colors ${item.level === 3 ? 'pl-4' : ''}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          <div 
            className="prose prose-invert prose-blue max-w-none mb-12 blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Internal Linking Rule */}
          {post.slug !== 'the-complete-guide-to-industrial-immersion-programs' && (
            <div className="mb-24 p-8 glass-card rounded-3xl border-blue-500/10 bg-blue-500/5">
              <p className="text-gray-300 font-medium">
                For a comprehensive explanation of structured industrial immersion models, read our{' '}
                <button 
                  onClick={() => onPostClick('the-complete-guide-to-industrial-immersion-programs')}
                  className="text-blue-500 font-bold hover:underline"
                >
                  complete guide to industrial immersion programs
                </button>.
              </p>
            </div>
          )}

          {/* Elite CTA Block */}
          <div className="glass-card p-12 md:p-20 rounded-[4rem] border-blue-500/20 relative overflow-hidden group mb-24">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-50" />
            <div className="relative z-10 text-center">
              <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Take the next step</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-10 uppercase tracking-tighter leading-none">
                Ready for <br /><span className="text-blue-500">Structured Industry Exposure?</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={onApplyClick}
                  className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm active:scale-95"
                >
                  Explore Programs
                </button>
                <button 
                  onClick={() => {
                    onApplyClick();
                    setTimeout(() => {
                      const el = document.getElementById('organisations');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                  className="w-full sm:w-auto px-12 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-sm"
                >
                  Partner With Us
                </button>
              </div>
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
                    onClick={() => onPostClick(rp.slug || '')}
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
        </div>

        {/* Sidebar TOC */}
        <aside className="hidden lg:block sticky top-32 h-fit">
          <div className="glass-card p-8 rounded-[2rem] border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">On this page</h3>
            <nav className="space-y-4">
              {toc.map(item => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`}
                  className={`block text-xs font-bold text-gray-500 hover:text-white transition-colors leading-relaxed ${item.level === 3 ? 'pl-4 border-l border-white/5' : ''}`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
            <div className="mt-10 pt-10 border-t border-white/5">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Share this insight</p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Copy'].map(platform => (
                  <button key={platform} className="text-gray-500 hover:text-blue-500 transition-colors text-xs font-bold">
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </article>
    </div>
  );
};

export default BlogPostDetail;


