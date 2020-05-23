const express = require("express");
const router = express.Router();
const Track = require("../models/Track.js");
const axios = require("axios");

//GET Track
router.get("/", async (req, res) => {
  const track = await Track.find(req.query).sort({ timestamp: -1 });
  console.log("/track Accessed");
  res.send(track);
});

//POST Track
router.post("/", (req, res) => {
  getCoord(req.body.address).then((value) => {
    const newTrack = {
      type: req.body.type,
      patientNo: req.body.patientNo,
      longitude: value.documents[0].x,
      latitude: value.documents[0].y,
      place: req.body.place,
      date: req.body.date,
      timestamp: new Date(req.body.date).getTime(),
    };
    Track.insertMany(newTrack, (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        console.log(docs.length + " track added");
      }
    });
    res.send(newTrack);
  });
});

function getCoord(address) {
  return axios({
    method: "get",
    url: "https://dapi.kakao.com/v2/local/search/address.json",
    headers: { Authorization: "KakaoAK c8c83e2c70e8c71ac7009435d8df4c29" },
    params: { query: address },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.error(err));
}

module.exports = router;
