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

router.route("/")
  .get(protect, adminOnly, getAllBookings)
  .post(protect, createBooking);

router.route("/my")
  .get(protect, getMyBookings);

router.route("/:id")
  .put(protect, adminOnly, updateBookingStatus)
  .delete(protect, adminOnly, deleteBooking);

module.exports = router;
