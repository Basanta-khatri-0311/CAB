const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/project.controller");
const { protect, adminOnly } = require('../middleware/auth.middleware')

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin-only routes
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

module.exports = router;
