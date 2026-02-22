const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./config");
const taskRoutes = require("./routes/task");

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use task routes
app.use("/tasks", taskRoutes);

// Basic route

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
