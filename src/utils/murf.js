export const speakWithMurf = async (text) => {
  console.log('[MURF] Speaking:', text); 
  try {
    const res = await fetch('http://localhost:5000/api/murf/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        text,
        voice_id: "en-US-natalie",  
        style: "Promo"              
      })
    });

    const data = await res.json();

    if (!data.audioFile) {
      console.error('No audio file returned:', data);
      return;
    }

    const audio = new Audio(data.audioFile);
    audio.play();
  } catch (err) {
    console.error('Murf TTS Error:', err);
  }
};
