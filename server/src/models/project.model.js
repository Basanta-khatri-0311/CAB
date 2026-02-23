const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expectedEndDate: {
      type: Date,
    },
    estimatedBudget: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "ongoing", "completed"],
      default: "planning",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
