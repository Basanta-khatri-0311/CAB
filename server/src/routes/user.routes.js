const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.use(protect);

// Personal profile (Any logged in user)
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/profile/password", changePassword);

// Admin-level management
router.use(adminOnly);

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
