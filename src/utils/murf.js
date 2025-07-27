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

    const audioUrl = data.audioFile;

    if (!audioUrl) {
      console.error("No audio file returned:", data);
      return;
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        reject(new Error("Audio playback failed"));
      };

      audio.onended = () => {
        resolve();
      };

      audio.play().catch((err) => {
        console.error("Audio play error:", err);
        reject(err);
      });
    });
  } catch (err) {
    console.error("Error calling Murf API:", err);
    throw err;
  }
};
