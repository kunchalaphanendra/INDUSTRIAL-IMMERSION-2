
import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { BlogPost, BlogPostInput, BlogPostStatus } from '../types';

const BLOG_CATEGORIES = [
  'Industry Insights',
  'Execution Framework',
  'Institutional Partnerships',
  'Workforce Development',
  'Education Reform'
];

const AdminBlogCMS: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await apiService.fetchAllBlogPostsForAdmin();
    setPosts(data);
    setIsLoading(false);
  };

  const handleCreate = () => {
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      image_alt_text: '',
      category: BLOG_CATEGORIES[0],
      tags: [],
      reading_time: 0,
      word_count: 0,
      status: 'draft',
      is_featured: false,
      meta_title: '',
      meta_description: '',
      keywords: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      og_image: '',
      slug_locked: false,
      author: 'STJUFENDS Editorial'
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const { success } = await apiService.deleteBlogPost(id);
    if (success) {
      loadPosts();
    } else {
      alert('Delete failed');
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    const { success } = await apiService.updateBlogPost(post.id, { is_featured: !post.is_featured });
    if (success) {
      loadPosts();
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateMetrics = (content: string) => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readingTime = Math.ceil(words / 200);
    return { words, readingTime };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { url, error } = await apiService.uploadBlogImage(file);
    if (url) {
      setCurrentPost(prev => ({ ...prev, cover_image: url, og_image: url }));
    } else {
      alert('Upload failed: ' + error);
    }
    setIsUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;
    setIsSaving(true);

    const { words, readingTime } = calculateMetrics(currentPost.content || '');

    const postInput: BlogPostInput = {
      title: currentPost.title || '',
      slug: currentPost.slug || generateSlug(currentPost.title || ''),
      excerpt: currentPost.excerpt || '',
      content: currentPost.content || '',
      cover_image: currentPost.cover_image || '',
      image_alt_text: currentPost.image_alt_text || '',
      category: currentPost.category || BLOG_CATEGORIES[0],
      tags: currentPost.tags || [],
      reading_time: readingTime,
      word_count: words,
      status: currentPost.status || 'draft',
      is_published: currentPost.status === 'published',
      is_featured: currentPost.is_featured || false,
      meta_title: currentPost.meta_title || currentPost.title || '',
      meta_description: currentPost.meta_description || currentPost.excerpt || '',
      keywords: currentPost.keywords || '',
      canonical_url: currentPost.canonical_url || '',
      og_title: currentPost.og_title || currentPost.meta_title || currentPost.title || '',
      og_description: currentPost.og_description || currentPost.meta_description || currentPost.excerpt || '',
      og_image: currentPost.og_image || currentPost.cover_image || '',
      slug_locked: currentPost.status === 'published' ? true : (currentPost.slug_locked || false),
      author: currentPost.author || 'STJUFENDS Editorial'
    };

    let result;
    if (currentPost.id) {
      result = await apiService.updateBlogPost(currentPost.id, postInput);
    } else {
      result = await apiService.createBlogPost(postInput);
    }

    if (result.success) {
      setIsEditing(false);
      setCurrentPost(null);
      loadPosts();
    } else {
      alert('Save failed: ' + result.error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isEditing && currentPost) {
    const isSlugLocked = currentPost.status === 'published' || currentPost.slug_locked;

    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold uppercase tracking-tighter">
              {currentPost.id ? 'Edit Elite Post' : 'Create Elite Post'}
            </h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">SEO & Authority Engine Active</p>
          </div>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Content Card */}
          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Post Title</label>
                <input 
                  type="text"
                  required
                  value={currentPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const updates: any = { title };
                    if (!isSlugLocked) {
                      updates.slug = generateSlug(title);
                    }
                    setCurrentPost({ ...currentPost, ...updates });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all text-lg font-bold"
                  placeholder="The Future of Industrial Immersion"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                  Slug (URL)
                  {isSlugLocked && <span className="text-[8px] text-amber-500">Locked (Published)</span>}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    disabled={isSlugLocked}
                    value={currentPost.slug}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all font-mono text-sm ${isSlugLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="future-of-industrial-immersion"
                  />
                  {isSlugLocked && <span className="absolute right-4 top-1/2 -translate-y-1/2">🔒</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</label>
                <select 
                  value={currentPost.category}
                  onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all appearance-none"
                >
                  {BLOG_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-black">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</label>
                <select 
                  value={currentPost.status}
                  onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value as BlogPostStatus })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all appearance-none"
                >
                  <option value="draft" className="bg-black">Draft</option>
                  <option value="published" className="bg-black">Published</option>
                  <option value="scheduled" className="bg-black">Scheduled</option>
                  <option value="archived" className="bg-black">Archived</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Author</label>
                <input 
                  type="text"
                  value={currentPost.author}
                  onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Excerpt (SEO Summary)</label>
              <textarea 
                required
                value={currentPost.excerpt}
                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all h-24 resize-none leading-relaxed"
                placeholder="A compelling summary for search results and social shares..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Content (Markdown/HTML)</label>
                <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                  <span>Words: {calculateMetrics(currentPost.content || '').words}</span>
                  <span>Read Time: {calculateMetrics(currentPost.content || '').readingTime} min</span>
                </div>
              </div>
              <textarea 
                required
                value={currentPost.content}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all h-[30rem] resize-none leading-relaxed"
                placeholder="## Introduction\n\nStart writing your authority content here..."
              />
            </div>
          </div>

          {/* Media Card */}
          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Visual Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cover Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all overflow-hidden group relative"
                >
                  {currentPost.cover_image ? (
                    <>
                      <img src={currentPost.cover_image} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <span className="text-3xl mb-2 block">🖼️</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {isUploading ? 'Uploading...' : 'Click to Upload Cover'}
                      </p>
                    </div>
                  )}
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Image Alt Text (SEO)</label>
                  <input 
                    type="text"
                    value={currentPost.image_alt_text}
                    onChange={(e) => setCurrentPost({ ...currentPost, image_alt_text: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    placeholder="Descriptive text for the image"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tags (Comma separated)</label>
                  <input 
                    type="text"
                    value={currentPost.tags?.join(', ')}
                    onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    placeholder="career, industry, skills"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO & Meta Card */}
          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">SEO & Social Meta</h3>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Featured Post</span>
                <button
                  type="button"
                  onClick={() => setCurrentPost({ ...currentPost, is_featured: !currentPost.is_featured })}
                  className={`w-10 h-5 rounded-full transition-all relative ${currentPost.is_featured ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${currentPost.is_featured ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta Title</label>
                  <input 
                    type="text"
                    value={currentPost.meta_title}
                    onChange={(e) => setCurrentPost({ ...currentPost, meta_title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    placeholder="SEO Optimized Title"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta Description</label>
                  <textarea 
                    value={currentPost.meta_description}
                    onChange={(e) => setCurrentPost({ ...currentPost, meta_description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all h-24 resize-none"
                    placeholder="Search engine description..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Canonical URL</label>
                  <input 
                    type="url"
                    value={currentPost.canonical_url}
                    onChange={(e) => setCurrentPost({ ...currentPost, canonical_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    placeholder="https://stjufends.com/blog/..."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">OG Title (Social)</label>
                  <input 
                    type="text"
                    value={currentPost.og_title}
                    onChange={(e) => setCurrentPost({ ...currentPost, og_title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    placeholder="Social Media Title"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">OG Description (Social)</label>
                  <textarea 
                    value={currentPost.og_description}
                    onChange={(e) => setCurrentPost({ ...currentPost, og_description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all h-24 resize-none"
                    placeholder="Social Media Description..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">OG Image URL</label>
                  <input 
                    type="url"
                    value={currentPost.og_image}
                    onChange={(e) => setCurrentPost({ ...currentPost, og_image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    placeholder="Social Share Image URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-10 glass-card rounded-[2.5rem] border-white/5 sticky bottom-8 z-20 backdrop-blur-3xl">
            <div className="flex items-center gap-6">
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                currentPost.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                currentPost.status === 'draft' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                'bg-blue-500/10 text-blue-500 border-blue-500/20'
              }`}>
                {currentPost.status}
              </div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Last Updated: {currentPost.updated_at ? new Date(currentPost.updated_at).toLocaleString() : 'Never'}
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-16 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.2em] text-sm disabled:opacity-50 active:scale-95"
            >
              {isSaving ? 'Deploying Content...' : 'Save & Sync Post'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold uppercase tracking-tighter">Elite Blog CMS</h2>
          <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Authority engine for industrial insights</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
        >
          + Create New Insight
        </button>
      </div>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Article</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Metrics</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-500 font-medium">No authority content found.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 overflow-hidden shrink-0 border border-white/10 relative">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📝</div>
                        )}
                        {post.is_featured && (
                          <div className="absolute top-0 right-0 bg-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg">★</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{post.title}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      post.status === 'draft' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {post.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] text-gray-500 font-medium space-y-0.5">
                      <p>{post.word_count} words</p>
                      <p>{post.reading_time} min read</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-2 rounded-lg transition-all ${post.is_featured ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-500/10'}`}
                        title={post.is_featured ? "Unfeature" : "Feature"}
                      >
                        ★
                      </button>
                      <button 
                        onClick={() => handleEdit(post)}
                        className="p-2 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 rounded-lg transition-all"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogCMS;
