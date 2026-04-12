const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/booking.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Optional protect for bookings
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
     return protect(req, res, next);
  }
  next();
};

router.route("/")
  .get(protect, adminOnly, getAllBookings)
  .post(optionalProtect, createBooking);

router.route("/my")
  .get(protect, getMyBookings);

router.route("/:id")
  .put(protect, adminOnly, updateBookingStatus)
  .delete(protect, adminOnly, deleteBooking);

module.exports = router;
