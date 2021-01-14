const express = require("express");
const router = express.Router();
const Status = require("../models/Status.js");

//GET Status
router.get("/", async (req, res) => {
  const status = await Status.find(req.query).sort({
    _id: 1,
  });
  console.log("/status Accessed");
  res.send(status);
});

module.exports = router;
