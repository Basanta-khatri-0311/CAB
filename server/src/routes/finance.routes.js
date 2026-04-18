const express = require("express");
const router = express.Router();
const {
  addFinance,
  getFinanceByProject,
  getAllFinances,
  transferBalance,
  updateFinance,
  deleteFinance
} = require("../controllers/finance.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", getAllFinances);
router.post("/", protect, adminOnly, addFinance);
router.put("/:id", protect, adminOnly, updateFinance);
router.delete("/:id", protect, adminOnly, deleteFinance);
router.post("/transfer", protect, adminOnly, transferBalance);
router.get("/:projectId", protect, getFinanceByProject);

module.exports = router;
