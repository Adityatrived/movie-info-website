// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express(); 

const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


app.use(cors());


// Proxy for popular movies with optional genre filtering
app.get('/api/discover', async (req, res) => {
  try {
    let url = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;
   
    if (req.query.with_genres) {
      url += `&with_genres=${encodeURIComponent(req.query.with_genres)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Proxy for movie search
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || "";
    const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to search movies" });
  }
});


app.use(express.static(path.join(__dirname, 'frontend')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
