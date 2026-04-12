const express = require("express");
const router = express.Router();
const {
  addFinance,
  getFinanceByProject,
  getAllFinances
} = require("../controllers/finance.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getAllFinances);
router.post("/", protect, adminOnly, addFinance);
router.get("/:projectId", protect, getFinanceByProject);

module.exports = router;
