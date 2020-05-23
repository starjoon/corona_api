const mongoose = require("mongoose");

var AllStatusSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: false,
      trim: true,
    },
    total: {
      type: Number,
      required: false,
      trim: true,
    },
    confirm: {
      type: Number,
      required: false,
      trim: true,
    },
    cured: {
      type: Number,
      required: false,
      trim: true,
    },
    death: {
      type: Number,
      required: false,
      trim: true,
    },
    deathRate: {
      type: Number,
      required: false,
      trim: true,
    },
    monitor: {
      type: Number,
      required: false,
      trim: true,
    },
    increment: {
      type: Number,
      required: false,
      trim: true,
    },
    world: {
      type: String,
      required: false,
      trim: true,
    },
    updatedDate: {
      type: mongoose.Schema.Types,
      required: false,
      trim: true,
    },
    reference: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { collection: "allStatus" },
  {}
);

const AllStatus = mongoose.model("AllStatus", AllStatusSchema);

module.exports = AllStatus;
