const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://listen-api.listennotes.com/api/v2';

app.get('/api/trending', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/best_podcasts`, {
      headers: { 'X-ListenAPI-Key': API_KEY }  // ✅ CORRECT USE
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Trending fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch trending podcasts' });
  }
});

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await fetch(`${BASE_URL}/search?q=${query}`, {
      headers: { 'X-ListenAPI-Key': API_KEY }  // ✅ CORRECT USE
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("🔴 Trending API Error:", err);
    res.status(500).json({ error: 'Search failed' });
  }
});
app.get('/api/podcast/:id', async (req, res) => {
  const podcastId = req.params.id;
  try {
    const response = await fetch(`${BASE_URL}/podcasts/${podcastId}?sort=recent_first`, {
      headers: { 'X-ListenAPI-Key': API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`Podcast fetch error for ID ${podcastId}:`, err);
    res.status(500).json({ error: 'Failed to fetch podcast episodes' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
