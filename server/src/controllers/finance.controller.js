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
