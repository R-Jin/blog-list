const config = require("./utils/config");
require("express-async-errors")
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const blogsRouter = require("./controllers/blogs");
const logger = require("./utils/logger");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Failed to connect to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
