// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const MURF_API_KEY = process.env.VITE_MURF_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/murf/speak', async (req, res) => {
  console.log('Received request:', req.body);
  try {
    const { text, voice_id = "en-US-natalie", style = "Promo" } = req.body;

    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'api-key': MURF_API_KEY, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({ text, voiceId: voice_id, style })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).send(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).send('Server error');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
