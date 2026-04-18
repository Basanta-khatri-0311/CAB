const User = require('../models/user.model.js');
const { generateToken } = require('../utils/generateToken.js');

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, roleInClub, bio, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // New members are always pending by default
    const userCount = await User.countDocuments();
    const status = userCount === 0 ? "active" : "pending"; // First user is active/admin
    const userRole = userCount === 0 ? "admin" : (role || "member");

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone,
      roleInClub,
      bio,
      status
    });

    res.status(201).json({
      message: "Registration successful. Please wait for an administrator to approve your account.",
      status: user.status
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'active') {
        return res.status(403).json({ 
          message: `Your account is ${user.status}. Please contact an administrator for activation.` 
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser }