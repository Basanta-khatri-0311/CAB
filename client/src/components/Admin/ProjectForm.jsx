import { useState, useEffect } from "react";

const defaultForm = {
  title: "",
  description: "",
  estimatedBudget: "",
  status: "planning",
};

export default function ProjectForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialData
      ? {
          title: initialData.title || "",
          description: initialData.description || "",
          estimatedBudget: initialData.estimatedBudget || "",
          status: initialData.status || "planning",
        }
      : defaultForm
    );
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
    <form onSubmit={handleSubmit}>

      <div className="form-field">
        <label className="form-label">Project Title</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Road Repair Phase 1"
          value={form.title}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          placeholder="Brief description of the project..."
          value={form.description}
          onChange={handleChange}
          className="form-textarea"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Estimated Budget (NPR)</label>
        <input
          type="number"
          name="estimatedBudget"
          placeholder="e.g. 500000"
          value={form.estimatedBudget}
          onChange={handleChange}
          className="form-input"
          min="0"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="planning">Planning</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="form-btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="form-btn-save" disabled={saving}>
          {saving ? "Saving…" : "Save Project"}
        </button>
      </div>

    </form>
  );
}