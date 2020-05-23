const mongoose = require("mongoose");

var PatientSchema = new mongoose.Schema(
  {
    cityNo: {
      type: Number,
      required: true,
      trim: true,
    },
    patientNo: {
      type: mongoose.Schema.Types,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: false,
      trim: true,
    },
    region2: {
      type: String,
      required: false,
      trim: true,
    },
    residence: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: mongoose.Schema.Types,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    wuhan: {
      type: Boolean,
      required: true,
      trim: true,
    },
    confirmDate: {
      type: mongoose.Schema.Types,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Number,
      required: true,
      trim: true,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: mongoose.Schema.Types,
      required: true,
      trim: true,
    },
    updatedDate: {
      type: mongoose.Schema.Types,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: "patients" },
  {}
);

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
