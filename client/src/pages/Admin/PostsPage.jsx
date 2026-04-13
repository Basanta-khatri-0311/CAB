import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", content: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("image", file);
    setLoading(true);

    try {
      const { data } = await API.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, image: data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/posts/${editingId}`, formData);
      } else {
        await API.post("/posts", formData);
      }
      setFormData({ title: "", content: "", image: "" });
      setEditingId(null);
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setFormData({ title: post.title, content: post.content, image: post.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await API.delete(`/posts/${id}`);
    fetchPosts();
  };

  if (loading) return <div className="loader-screen"><div className="loader-spinner"></div></div>;

  return (
    <div className="page-wrapper fade-up">
      <h1 className="page-title">Manage Posts</h1>
      
      <div className="login-card max-w-full mb-10">
        <h2 className="section-title">{editingId ? "Edit Post" : "New Post"}</h2>
        <form onSubmit={handleSubmit}>
          <input className="login-input mb-[10px]" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <div className="form-field">
            <label className="form-label">Featured Image</label>
            <input type="file" className="login-input p-2" onChange={uploadFileHandler} />
            {formData.image && <p className="text-[10px] text-[#10b981] mt-[5px]">Image uploaded: {formData.image}</p>}
          </div>

          <textarea className="login-input mb-[10px]" placeholder="Content" required rows="5" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
          
          <div className="flex gap-[10px]">
            <button type="submit" className="login-submit">
              {editingId ? "Update Record" : "Publish News"}
            </button>
            {editingId && (
              <button type="button" className="login-submit bg-gray-700 hover:bg-gray-600" onClick={() => { setEditingId(null); setFormData({ title: "", content: "", image: "" }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Title</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id} className="tx-row">
                <td className="font-semibold">{post.title}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(post)} className="text-[#d97706] bg-none border-none cursor-pointer mr-3 hover:text-white transition-colors">Edit</button>
                  <button onClick={() => deletePost(post._id)} className="text-[#ef4444] bg-none border-none cursor-pointer hover:text-white transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
