const Project = require('../models/project.model.js');
const Finance = require('../models/finance.model.js');
const User = require('../models/user.model.js');
const Post = require('../models/post.model.js');

const attachFullUrl = (item, field) => {
  if (item && item[field] && typeof item[field] === 'string' && !item[field].startsWith("http")) {
    const baseUrl = process.env.BASE_URL || "http://localhost:5500";
    item[field] = `${baseUrl}${item[field].startsWith("/") ? "" : "/"}${item[field]}`;
  }
  return item;
};

const getHomeData = async (req, res) => {
  try {
   
    // 1. Stats
    const incomeData = await Finance.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const expenseData = await Finance.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalIncome = incomeData[0]?.total || 0;
    const totalExpense = expenseData[0]?.total || 0;

    const stats = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };

    
    // 2. Members
    const membersRaw = await User.find({ status: "active" })
      .select("name photo roleInClub bio phone createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const members = membersRaw.map(m => attachFullUrl(m, 'photo'));

    
    // 3. Posts
    const postsRaw = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const posts = postsRaw.map(p => attachFullUrl(p, 'image'));

    
    // 4. All Projects with Money Used
    const allProjectsRaw = await Project.find().sort({ createdAt: -1 }).lean();
    
    const projects = await Promise.all(allProjectsRaw.map(async (p) => {
      const expenses = await Finance.aggregate([
        { $match: { projectId: p._id, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      return { ...p, moneyUsed: expenses[0]?.total || 0 };
    }));

    res.json({
      stats,
      members,
      posts,
      projects
    });

  } catch (error) {
    console.error("Home Data Fetch Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getPublicMembers = async (req, res) => {
  try {
    const raw = await User.find({ status: "active" })
      .select("-password -email")
      .sort({ name: 1 })
      .lean();
    const members = raw.map(m => attachFullUrl(m, 'photo'));
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicPosts = async (req, res) => {
  try {
    const raw = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();
    const posts = raw.map(p => attachFullUrl(p, 'image'));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomeData,
  getPublicMembers,
  getPublicPosts
};