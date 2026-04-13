import { useState, useEffect } from "react";
import API from "../../api/axios";
import Modal from "../../components/ui/Modal";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  role: "member",
  roleInClub: "Player",
  phone: "",
  bio: "",
  photo: ""
};

export default function MembersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("image", file);
    setLoading(true);

    try {
      const { data } = await API.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, photo: data });
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const closeModal = () => { setIsOpen(false); setFormData(defaultForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/users/${editingId}`, formData);
      } else {
        await API.post("/users", formData);
      }
      closeModal();
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || "Operation failed"); }
  };

  const handleEdit = (u) => {
    setEditingId(u._id);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      roleInClub: u.roleInClub || "Player",
      phone: u.phone || "",
      bio: u.bio || "",
      photo: u.photo || "",
      password: "" 
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  if (loading) return <div className="loader-screen"><div className="loader-spinner"></div></div>;

  return (
    <div className="page-wrapper fade-up">
      <header className="admin-page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="project-description">Manage club members, staff, and administrative access.</p>
        </div>
        <button className="admin-add-btn" onClick={() => setIsOpen(true)}>+ Add Member</button>
      </header>

      <div className="table-wrapper mt-[30px]">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Club Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="tx-row">
                <td>
                  <div className="w-10 h-10 rounded-full bg-[#111] overflow-hidden border border-[#d97706]">
                    {u.photo ? <img src={u.photo} alt={u.name} className="w-full h-full object-cover" /> : <div className="text-[14px] leading-10 text-center text-[#d97706]">{u.name.charAt(0)}</div>}
                  </div>
                </td>
                <td className="font-semibold">{u.name}</td>
                <td className="tx-desc">{u.email}</td>
                <td>
                  <span className={`status-badge ${u.role === 'admin' ? 'status-completed' : 'status-ongoing'} text-[9px]`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-[#d97706] text-[12px] font-medium">{u.roleInClub}</td>
                <td>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(u)} className="text-[#d97706] bg-none border-none cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(u._id)} className="text-[#ef4444] bg-none border-none cursor-pointer">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title={editingId ? "Edit Member" : "Add New Member"}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label">Profile Photo</label>
            <input type="file" className="form-input" onChange={uploadFileHandler} />
            {formData.photo && <p className="text-[10px] text-[#10b981] mt-[5px]">Photo uploaded: {formData.photo}</p>}
          </div>
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label">Password {editingId && "(Leave blank to keep current)"}</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required={!editingId} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">System Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="member">Member (Standard)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Club Position</label>
              <select name="roleInClub" value={formData.roleInClub} onChange={handleChange} className="form-select">
                <option value="Player">Player</option>
                <option value="Coach">Coach</option>
                <option value="Staff">Staff</option>
                <option value="Board Member">Board Member</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-actions">
            <button type="button" className="form-btn-cancel" onClick={closeModal}>Cancel</button>
            <button type="submit" className="form-btn-save">{editingId ? "Update Member" : "Create Account"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
