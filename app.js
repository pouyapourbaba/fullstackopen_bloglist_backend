require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");

console.log("Connecting to MongoDB..");

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(error =>
    console.log(`Could not connect to MongoDB: ${error.message}`)
  );

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
