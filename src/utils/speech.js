// utils/speech.js
export const startListening = () => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return reject(new Error("Speech recognition not supported"));
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (err) => {
      reject(err);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start error:", err);
    }
  });
};
