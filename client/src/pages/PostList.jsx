import { useState, useEffect } from "react";
import axios from "axios";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/public/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading Announcements...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-up">
      <header className="page-header mb-[60px] rounded-[20px]">
        <div className="section-eyebrow">Announcements</div>
        <h1 className="page-title">Club Feed</h1>
        <p className="page-subtitle">
          Updates, match reports, and records from the Cricket Association of Bhaluhi.
        </p>
      </header>

      <div className="projects-grid grid-cols-1">
        {posts.map((post) => (
          <article key={post._id} className="project-card cursor-default">
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-[300px] object-cover rounded-[12px] mb-5" 
              />
            )}
            <div className="section-eyebrow mb-[5px]">
              {new Date(post.createdAt).toLocaleDateString()} • By {post.author.name}
            </div>
            <h2 className="page-title text-[28px] text-left">{post.title}</h2>
            <div className="project-card__desc text-[16px] text-[#e5e7eb] whitespace-pre-wrap">
              {post.content}
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">No posts yet</div>
      )}
    </div>
  );
}
