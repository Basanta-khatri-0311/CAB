const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/project.controller");

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

module.exports = router;
