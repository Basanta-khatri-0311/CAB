const Project = require('../models/project.model.js');
const Finance = require('../models/finance.model.js');
const User = require('../models/user.model.js');
const Post = require('../models/post.model.js');

const getPublicStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: "completed" });
    const ongoingProjects = await Project.countDocuments({ status: "ongoing" });

    const incomeData = await Finance.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expenseData = await Finance.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = incomeData.length > 0 ? incomeData[0].total : 0;
    const totalExpense = expenseData.length > 0 ? expenseData[0].total : 0;
    const remainingBalance = totalIncome - totalExpense;
    const totalMembers = await User.countDocuments({ role: "member" });

    res.json({
      totalProjects,
      completedProjects,
      ongoingProjects,
      totalIncome,
      totalExpense,
      remainingBalance,
      totalMembers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getPublicPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" })
      .select("-password -email")
      .sort({ name: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicFinances = async (req, res) => {
  try {
    const finances = await Finance.find()
      .sort({ date: -1 });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPublicStats,
  getPublicPosts,
  getPublicMembers,
  getPublicFinances
};