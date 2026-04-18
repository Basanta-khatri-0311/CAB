const Finance = require("../models/finance.model");

// Add Finance Entry
exports.addFinance = async (req, res) => {
  try {
    const finance = await Finance.create(req.body);
    res.status(201).json(finance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Finances (Admin)
exports.getAllFinances = async (req, res) => {
  try {
    const finances = await Finance.find()
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Finance by Project
exports.getFinanceByProject = async (req, res) => {
  try {
    const finance = await Finance.find({
      projectId: req.params.projectId,
    }).sort({ createdAt: -1 });

    res.json(finance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Transfer Balance between projects
exports.transferBalance = async (req, res) => {
  const { fromProjectId, toProjectId, amount, description } = req.body;
  
  if (!fromProjectId || !toProjectId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1. Create Expense in 'from' project
    const expense = await Finance.create({
      projectId: fromProjectId,
      type: "expense",
      amount,
      sourceOrVendor: `Transfer to ${toProjectId}`,
      description: description || `Transfer balance to another project`,
      donorType: "project"
    });

    // 2. Create Income in 'to' project
    const income = await Finance.create({
      projectId: toProjectId,
      type: "income",
      amount,
      sourceOrVendor: `Transfer from ${fromProjectId}`,
      description: description || `Transferred balance from another project`,
      donorType: "project"
    });

    res.status(201).json({ expense, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
