const mongoose = require("mongoose");

var StatusSchema = new mongoose.Schema(
  {
    type: String,
    region: [
      {
        name: {
          type: String,
          trim: true,
        },
        total: {
          count: { type: String, trim: true },
          inc: { type: String, trim: true },
        },
        cured: {
          count: { type: String, trim: true },
          inc: { type: String, trim: true },
        },
        monitor: {
          count: { type: String, trim: true },
          inc: { type: String, trim: true },
        },
        death: {
          count: { type: String, trim: true },
          inc: { type: String, trim: true },
        },
      },
    ],
    updatedDate: {
      type: mongoose.Schema.Types,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
  },
  { collection: "status" }
);

const Status = mongoose.model("status", StatusSchema);

module.exports = Status;
