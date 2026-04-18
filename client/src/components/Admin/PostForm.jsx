import { useState, useEffect } from "react";

const defaultForm = {
  title: "",
  content: "",
  image: "",
};

export default function PostForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

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

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Cover Image URL</label>
        <input
          type="text"
          name="image"
          placeholder="https://images.unsplash.com/..."
          value={form.image}
          onChange={handleChange}
          className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-gray-400 font-medium focus:border-brand transition-colors text-xs"
        />
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
