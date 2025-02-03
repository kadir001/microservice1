const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Timestamp Microservice" });
});

// Timestamp endpoint
app.get("/api/:date?", (req, res) => {
  let { date } = req.params;

  if (!date) {
    date = new Date();
  } else if (!isNaN(date)) {
    date = new Date(parseInt(date));
  } else {
    date = new Date(date);
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
