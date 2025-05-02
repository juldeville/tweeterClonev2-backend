const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Missing MongoDB connection string in env");
}

mongoose
  .connect(connectionString, { connectTimeoutMS: 500 })
  .then((data) => console.log("Database connected"))
  .catch((err) => console.error(err.message));
