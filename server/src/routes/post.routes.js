const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.route("/")
  .get(getPosts)
  .post(protect, adminOnly, createPost);

router.route("/:id")
  .put(protect, adminOnly, updatePost)
  .delete(protect, adminOnly, deletePost);

module.exports = router;
