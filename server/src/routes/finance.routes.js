const express = require("express");
const router = express.Router();
const {
  addFinance,
  getFinanceByProject,
  getAllFinances,
  transferBalance
} = require("../controllers/finance.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getAllFinances);
router.post("/", protect, adminOnly, addFinance);
router.post("/transfer", protect, adminOnly, transferBalance);
router.get("/:projectId", protect, getFinanceByProject);

module.exports = router;
