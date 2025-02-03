require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const urlParser = require('url');
const shortid = require('shortid');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// URL Schema
const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});

const Url = mongoose.model("Url", urlSchema);

// Home route
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  let { url } = req.body;

  // Check if URL starts with "http://" or "https://"
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Parse the URL
  const parsedUrl = urlParser.parse(url);

  // Validate hostname with DNS lookup
  dns.lookup(parsedUrl.hostname, async (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Generate a short ID
    const shortUrl = shortid.generate();

    // Save to database
    const newUrl = new Url({ original_url: url, short_url: shortUrl });
    await newUrl.save();

    res.json({ original_url: url, short_url: shortUrl });
  });
});


// API to redirect to the original URL
app.get('/api/shorturl/:short', async (req, res) => {
  const shortUrl = req.params.short;
  const foundUrl = await Url.findOne({ short_url: shortUrl });

  if (foundUrl) {
    return res.redirect(foundUrl.original_url);
  } else {
    return res.json({ error: 'No short URL found' });
  }
});

// Hello API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
