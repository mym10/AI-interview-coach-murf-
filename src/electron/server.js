import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const MURF_API_KEY = process.env.MURF_API_KEY || 'ap2_5bb7fd4f-f5d6-451b-8adf-851403991026';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/murf/speak', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      {
        text,
        voiceId: 'en-US-natalie' // You can replace this with another supported voice ID
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

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
