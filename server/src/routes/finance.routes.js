const express = require("express");
const router = express.Router();
const {
  addFinance,
  getFinanceByProject,
} = require("../controllers/finance.controller");

router.post("/", addFinance);
router.get("/:projectId", getFinanceByProject);

module.exports = router;
