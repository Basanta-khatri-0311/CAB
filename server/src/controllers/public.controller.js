const Project = require('../models/project.model.js');
const Finance = require('../models/finance.model.js');
const User = require('../models/user.model.js')

const getPublicStats = async (req, res) => {
  try {
    // Project counts
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: "completed" });
    const ongoingProjects = await Project.countDocuments({ status: "ongoing" });

    // Finance aggregation
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

    // Members count
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


module.exports = getPublicStats