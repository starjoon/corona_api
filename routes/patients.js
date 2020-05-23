const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient.js');

//GET Patients
router.get('/', async (req, res) => {
  let limit = 30;

  const patients = await Patient.find(req.query).limit(limit).sort({
    timestamp: -1,
    patientNo: 1,
  });
  console.log('/patients Accessed');
  res.send(patients);
});

router.get('/:patientNo', async (req, res) => {
  const patientNo = await Patient.find({
    patientNo: req.params.patientNo,
  });
  res.send(patientNo);
});

//POST Patients
router.post('/', (req, res) => {
  const newPatient = new Patient({
    cityNo: req.body.cityNo,
    patientNo: req.body.patientNo,
    region: req.body.region,
    region2: req.body.region2,
    residence: req.body.residence,
    gender: req.body.gender,
    age: req.body.age,
    country: req.body.country,
    wuhan: req.body.wuhan,
    confirmDate: req.body.confirmDate,
    timestamp: getTS(req.body.confirmDate),
    hospital: req.body.hospital,
    contact: req.body.contact,
    updatedDate: req.body.updatedDate,
    status: '입원',
  });

  Patient.updateMany({}, { updatedDate: req.body.updatedDate }, (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      console.log(docs.n + ' patient updated');
    }
  });

  newPatient.save().then((addition) => res.send(addition));
  console.log('new patient added');
});

function getTS(d) {
  dSplit = d.split(' ');
  fullDate = `${dSplit[0].slice(0, -1)}/${dSplit[1].slice(0, -1)}/2020`;
  return new Date(fullDate).getTime();
}

module.exports = router;
