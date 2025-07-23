export const speakWithMurf = async (text) => {
  try {
    const res = await fetch('http://localhost:5000/api/murf/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    const audioUrl = data.audioFile;

    const audio = new Audio(audioUrl);
    audio.play();
  } catch (err) {
    console.error('Murf TTS Error:', err);
  }
};
