import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MURF_API_KEY = process.env.MURF_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

const distPath = path.resolve(__dirname, '../../dist');
// Serve frontend
app.use(express.static(distPath));

app.post('/api/murf/speak', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      {
        text,
        voiceId: 'en-US-natalie'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'api-key': MURF_API_KEY
        }
      }
    );

    const audioFile = response.data.audioFile;
    res.json({ audioFile });
  } catch (err) {
    console.error('Error calling Murf API:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate voice' });
  }
});

// Catch-all for SPA routing
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
