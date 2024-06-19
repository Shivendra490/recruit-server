const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();

const port = process.env.PORT || 8080;

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.send("home route");
});

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  return res.status(status).json({ message: err.message });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Server is UP at port ", port);
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log("mongoose catch ERROR", err));
