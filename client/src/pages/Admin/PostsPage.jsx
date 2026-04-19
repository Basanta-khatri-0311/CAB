import { useEffect, useState } from "react";
import API from "../../api/axios";
import Modal from "../../components/ui/Modal";
import PostForm from "../../components/Admin/PostForm";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAdd = () => {
    setEditingPost(null);
    setIsOpen(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await API.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert("Error deleting post.");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPost) {
        await API.put(`/posts/${editingPost._id}`, formData);
      } else {
        await API.post("/posts", formData);
      }
      setIsOpen(false);
      fetchPosts();
    } catch (err) {
      alert("Error saving post.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      {/* Header */}
      <div className="py-16 px-6 bg-zinc-900/10 border-b border-white/5 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <span className="section-eyebrow tracking-[0.3em]">Command Center</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 decoration-brand underline underline-offset-8 decoration-4">The Newsroom</h1>
            <p className="text-gray-500 text-xs max-w-lg leading-relaxed">
               Draft official club reports, share match results, and manage club announcements.
            </p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl text-xs transition-all transform hover:scale-105 shadow-xl shadow-brand/20 active:scale-95"
          >
            + Draft Post
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Syncing Chronicles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest font-medium">No posts in the newsroom library.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl transition-all hover:border-brand/40 hover:-translate-y-1 backdrop-blur-sm">
                  <div className="h-48 overflow-hidden relative">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-all duration-700" />
                    ) : (
                       <div className="w-full h-full bg-black flex items-center justify-center text-brand text-4xl font-black">CAB</div>
                    )}
                    <div className="absolute top-4 left-4">
                       <span className="bg-brand text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Official</span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-brand/50" />
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{post.author.name}</span>
                      </div>
                      <h2 className="text-2xl font-black text-white tracking-tighter mb-4 group-hover:text-brand transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-3 mb-8">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex justify-end gap-6 pt-6 border-t border-white/5">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                      >
                         Modify
                      </button>
                      <button 
                         onClick={() => handleDelete(post._id)}
                         className="text-[10px] font-black uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors"
                      >
                         Erase
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editingPost ? "Edit Chronicle" : "Draft New Chronicle"}
        >
          <div className="p-6">
            <PostForm
              initialData={editingPost}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
