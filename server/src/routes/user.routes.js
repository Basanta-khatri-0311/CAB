const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile
} = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.use(protect);

// Personal profile (Any logged in user)
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Admin-level management
router.use(adminOnly);

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
