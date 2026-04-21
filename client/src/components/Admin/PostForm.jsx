import { useState, useEffect } from "react";
import API from "../../api/axios";

const defaultForm = {
  title: "",
  content: "",
  image: "",
};

export default function PostForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        content: initialData.content || "",
        image: initialData.image || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm({ ...form, image: data });
    } catch (err) {
      alert("Flash upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Chronicle Title</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Bhaluhi Warriors Win the Finals"
          value={form.title}
          onChange={handleChange}
          className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white font-black tracking-tight focus:border-brand transition-colors text-sm"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Cover Image (URL or Local)</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={handleChange}
              className="flex-grow bg-black border border-white/10 rounded-xl px-6 py-4 text-gray-400 font-medium focus:border-brand transition-colors text-xs"
            />
            <label className="shrink-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl px-6 py-4 cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {uploading ? '...' : 'Upload'}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
        {form.image && (
          <div className="h-32 rounded-xl overflow-hidden border border-white/5 bg-black">
             <img loading="lazy" src={form.image} className="w-full h-full object-cover opacity-50" alt="Preview" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">The Narrative</label>
        <textarea
          name="content"
          placeholder="Narrate the story here..."
          value={form.content}
          onChange={handleChange}
          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-gray-300 font-medium focus:border-brand transition-colors text-sm"
          rows="6"
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button" 
          onClick={onClose} 
          className="flex-grow bg-white/5 hover:bg-white/10 text-gray-500 font-black uppercase tracking-widest py-4 rounded-xl text-[10px] transition-all"
        >
          Abort
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="flex-grow bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-4 rounded-xl text-[10px] transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Commit Chronicle"}
        </button>
      </div>
    </form>
  );
}
