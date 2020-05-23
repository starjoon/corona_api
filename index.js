const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config");
var cron = require("./cron");

//Initial Page
app.get("/", (req, res) => {
  res.send(
    "Welcome to nCoV-KR API, please visit /patients, /status, /caution for more info"
  );
});

//Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/patients", require("./routes/patients.js"));
app.use("/allStatus", require("./routes/allStatus.js"));
app.use("/track", require("./routes/track.js"));

//Initialize Mongoose and connect
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => {
  console.log(`Server started on port ${config.PORT}`);
});

app.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});