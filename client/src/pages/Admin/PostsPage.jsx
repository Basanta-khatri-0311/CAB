import { useState, useEffect } from "react";
import axios from "axios";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", content: "", image: "" });

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/posts");
    setPosts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    await axios.post("http://localhost:5000/api/posts", formData, config);
    setFormData({ title: "", content: "", image: "" });
    fetchPosts();
  };

  const deletePost = async (id) => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    await axios.delete(`http://localhost:5000/api/posts/${id}`, config);
    fetchPosts();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-wrapper fade-up">
      <h1 className="page-title">Manage Posts</h1>
      
      <div className="login-card" style={{ maxWidth: "100%", marginBottom: "40px" }}>
        <h2 className="section-title">New Post</h2>
        <form onSubmit={handleSubmit}>
          <input className="login-input" placeholder="Title" required style={{ marginBottom: "10px" }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input className="login-input" placeholder="Image URL" style={{ marginBottom: "10px" }} value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          <textarea className="login-input" placeholder="Content" required rows="5" style={{ marginBottom: "10px" }} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
          <button type="submit" className="login-submit">Publish Post</button>
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
                <td>{post.title}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td><button onClick={() => deletePost(post._id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
