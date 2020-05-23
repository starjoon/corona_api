const mongoose = require("mongoose");

var TrackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: false,
      trim: true,
    },
    patientNo: {
      type: String,
      required: true,
      trim: true,
    },
    longitude: {
      type: Number,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { collection: "track" },
  {}
);

const Track = mongoose.model("Track", TrackSchema);

module.exports = Track;
