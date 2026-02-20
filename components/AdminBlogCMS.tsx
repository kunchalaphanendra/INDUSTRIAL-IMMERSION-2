
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BlogPost, BlogPostInput } from '../types';

const AdminBlogCMS: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      meta_title: '',
      meta_description: '',
      keywords: '',
      author: 'STJUFENDS Editorial',
      is_published: false
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

  const handleTogglePublish = async (post: BlogPost) => {
    const { success } = await apiService.updateBlogPost(post.id, { is_published: !post.is_published });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;
    setIsSaving(true);

    const postInput: BlogPostInput = {
      title: currentPost.title || '',
      slug: currentPost.slug || generateSlug(currentPost.title || ''),
      excerpt: currentPost.excerpt || '',
      content: currentPost.content || '',
      cover_image: currentPost.cover_image || '',
      meta_title: currentPost.meta_title || currentPost.title || '',
      meta_description: currentPost.meta_description || currentPost.excerpt || '',
      keywords: currentPost.keywords || '',
      author: currentPost.author || 'STJUFENDS Editorial',
      is_published: currentPost.is_published || false
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
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold uppercase tracking-tighter">
            {currentPost.id ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Title</label>
                <input 
                  type="text"
                  required
                  value={currentPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setCurrentPost({ 
                      ...currentPost, 
                      title, 
                      slug: currentPost.id ? currentPost.slug : generateSlug(title) 
                    });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Slug (URL)</label>
                <input 
                  type="text"
                  required
                  value={currentPost.slug}
                  onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                  placeholder="post-url-format"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Excerpt</label>
              <textarea 
                required
                value={currentPost.excerpt}
                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all h-24 resize-none"
                placeholder="Brief summary of the post"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Content (Markdown/HTML)</label>
              <textarea 
                required
                value={currentPost.content}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all h-96 resize-none"
                placeholder="Write your post content here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cover Image URL</label>
                <input 
                  type="url"
                  value={currentPost.cover_image}
                  onChange={(e) => setCurrentPost({ ...currentPost, cover_image: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Author</label>
                <input 
                  type="text"
                  value={currentPost.author}
                  onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border-white/5 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">SEO Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta Title</label>
                <input 
                  type="text"
                  value={currentPost.meta_title}
                  onChange={(e) => setCurrentPost({ ...currentPost, meta_title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                  placeholder="SEO Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Meta Description</label>
                <textarea 
                  value={currentPost.meta_description}
                  onChange={(e) => setCurrentPost({ ...currentPost, meta_description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all h-20 resize-none"
                  placeholder="SEO Description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Keywords</label>
                <input 
                  type="text"
                  value={currentPost.keywords}
                  onChange={(e) => setCurrentPost({ ...currentPost, keywords: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-8 glass-card rounded-3xl border-white/5">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentPost({ ...currentPost, is_published: !currentPost.is_published })}
                className={`w-12 h-6 rounded-full transition-all relative ${currentPost.is_published ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${currentPost.is_published ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                {currentPost.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Post'}
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
          <h2 className="text-3xl font-heading font-bold uppercase tracking-tighter">Blog CMS</h2>
          <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Manage editorial content & SEO</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
        >
          + New Post
        </button>
      </div>

      <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Post</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-gray-500 font-medium">No blog posts found.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden shrink-0 border border-white/10">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📝</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{post.title}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleTogglePublish(post)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                        post.is_published 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {post.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
