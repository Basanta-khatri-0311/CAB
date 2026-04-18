const User = require("../models/user.model");
const Finance = require("../models/finance.model");

const attachFullUrl = (item, field) => {
  if (item[field] && !item[field].startsWith("http")) {
    const baseUrl = process.env.BASE_URL || "http://localhost:5500";
    item[field] = `${baseUrl}${item[field].startsWith("/") ? "" : "/"}${item[field]}`;
  }
  return item;
};

// GET all users (Admins only)
exports.getUsers = async (req, res) => {
  try {
    const raw = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    const users = raw.map(u => attachFullUrl(u, 'photo'));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE a new user/member (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, roleInClub, phone, bio } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already taken" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "member",
      roleInClub,
      phone,
      bio
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, role, roleInClub, phone, bio, status } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.roleInClub = roleInClub || user.roleInClub;
    user.phone = phone || user.phone;
    user.bio = bio || user.bio;
    user.status = status || user.status;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET current user profile
exports.getProfile = async (req, res) => {
  try {
    const raw = await User.findById(req.user._id).select("-password").lean();
    const user = attachFullUrl(raw, 'photo');
    // Also get their personal donations
    const donations = await Finance.find({ memberId: req.user._id })
      .populate("projectId", "title")
      .sort({ date: -1 });
    res.json({ user, donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE current user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.bio = req.body.bio || user.bio;
    user.photo = req.body.photo || user.photo;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers: exports.getUsers,
  createUser: exports.createUser,
  updateUser: exports.updateUser,
  deleteUser: exports.deleteUser,
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile
};
