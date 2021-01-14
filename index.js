const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config");
const cron = require("./cron");

//Initial Page
app.get("/", (req, res) => {
  res.send(
    "Welcome to nCoV-KR API made by Joon Choi. Please visit /patients, /status, /track for more info"
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
app.use("/status", require("./routes/status.js"));
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
