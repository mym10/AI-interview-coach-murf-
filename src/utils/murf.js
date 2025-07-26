export const speakWithMurf = async (text) => {
  try {
    const response = await fetch("http://localhost:5000/api/murf/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": import.meta.env.VITE_MURF_API_KEY,
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    const audioUrl = data.audioFile; // 🧠 This is the correct field

    if (!audioUrl) {
      console.error("No audio file returned:", data);
      return;
    }

    const audio = new Audio(audioUrl);
    audio.onerror = (e) => console.error("Audio playback error", e);

    await audio.play();
    return new Promise((resolve) => {
      audio.onended = resolve;
    });
  } catch (err) {
    console.error("Error calling Murf API:", err);
  }
};
