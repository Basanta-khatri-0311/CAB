import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { useState, useEffect } from "react";
import API from "../api/axios";
import Modal from "../components/ui/Modal";
import PostForm from "../components/Admin/PostForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { HiPencil, HiTrash } from "react-icons/hi2";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  
  const { user } = useAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAdd = () => {
    setEditingPost(null);
    setIsAdminModalOpen(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsAdminModalOpen(true);
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Post",
      message: "Are you sure you want to remove this story? This cannot be undone.",
      onConfirm: async () => {
        try {
          await API.delete(`/posts/${id}`);
          showToast("Post deleted", "success");
          fetchPosts();
        } catch (err) {
          showToast("Error deleting post.", "error");
        }
      }
    });
  };

  const handleAdminSubmit = async (formData) => {
    try {
      if (editingPost) {
        await API.put(`/posts/${editingPost._id}`, formData);
      } else {
        await API.post("/posts", formData);
      }
      setIsAdminModalOpen(false);
      showToast(editingPost ? "Post updated" : "Post published", "success");
      fetchPosts();
    } catch (err) {
      showToast("Operation failed.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-gray-300 uppercase">Loading Posts</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      {/* Header */}
      <div className="py-16 px-6 bg-zinc-900/10 border-b border-white/5 mb-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <span className="section-eyebrow tracking-[0.2em]">Latest Updates</span>
            <div className="flex items-center gap-6 mb-4">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Club News</h1>
              {user?.role === 'admin' && (
                <button 
                  onClick={handleAdd}
                  className="bg-brand hover:bg-brand-dark text-black text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-brand/20 active:scale-95 transition-all"
                >
                  + Add New Post
                </button>
              )}
            </div>
            <p className="text-gray-300 text-xs max-w-lg leading-relaxed">
              Read the latest match reports and official club announcements.
            </p>
          </div>
          <div className="pb-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{posts.length} Total Posts</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <article 
              key={post._id} 
              className="group bg-zinc-900/40 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col transition-all duration-500 hover:border-brand/30 hover:-translate-y-2 relative shadow-2xl cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              
              {/* Admin Context Menu */}
              {user?.role === 'admin' && (
                <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                    className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-brand hover:bg-brand hover:text-black transition-all shadow-xl"
                    title="Edit Post"
                  >
                    <HiPencil size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                    className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    title="Delete Post"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              )}

              <div className="h-64 overflow-hidden relative">
                {post.image ? (
                  <img loading="lazy" src={optimizeCloudinaryUrl(post.image)} alt={post.title} className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center text-zinc-800 text-4xl font-black">
                    CAB
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-8">
                   <span className="px-3 py-1 rounded-full bg-brand text-black text-[9px] font-black uppercase tracking-widest shadow-xl">Club Update</span>
                </div>
              </div>

              <div className="p-6 md:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-brand/40"></div>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    By {post.author?.name || "Member"}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-6 leading-tight group-hover:text-brand transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-300 text-sm leading-relaxed font-medium line-clamp-4 flex-grow mb-8">
                  {post.content}
                </p>

                <div className="pt-8 border-t border-white/5 flex justify-between items-center group-hover:border-brand/20 transition-colors">
                   <span className="text-[10px] font-black uppercase tracking-widest text-brand transition-all group-hover:translate-x-2 underline underline-offset-4">Read Full Post →</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-40 text-center">
             <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-xs">No news posts found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        title={editingPost ? "Edit Post" : "Add New Post"}
      >
        <div className="p-6">
          <PostForm
            initialData={editingPost}
            onSubmit={handleAdminSubmit}
            onClose={() => setIsAdminModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Newsroom"
        wide={true}
        noPadding={true}
      >
        {selectedPost && (
          <div className="flex flex-col">
            <div className="h-64 sm:h-96 w-full relative shrink-0">
              {selectedPost.image ? (
                <img loading="lazy" src={optimizeCloudinaryUrl(selectedPost.image)} alt={selectedPost.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-zinc-900 text-6xl font-black">CAB</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>

            <div className="p-6 sm:p-10 -mt-10 relative z-10 bg-[#0a0a0a] backdrop-blur-3xl rounded-t-[3rem] border-t border-white/5">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-brand text-black text-[9px] font-black uppercase tracking-widest shadow-xl">Club Update</span>
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">{new Date(selectedPost.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                <div className="w-1 h-1 rounded-full bg-white/10"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">By {selectedPost.author?.name || "Official"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
                {selectedPost.title}
              </h2>

              <div className="w-20 h-1 bg-brand mb-10 rounded-full"></div>

              <div className="text-gray-300 text-lg leading-relaxed space-y-6 font-medium">
                {selectedPost.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand hover:text-black transition-all"
                >
                  Close 
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
