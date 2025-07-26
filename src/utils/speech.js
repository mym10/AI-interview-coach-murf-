export const startListening = () => {
  return new Promise((resolve, reject) => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        return reject("SpeechRecognition API not supported");
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => console.log("🎤 Listening started...");
      recognition.onaudiostart = () => console.log("🔊 Audio capture started");
      recognition.onspeechstart = () => console.log("🗣️ Speech has been detected");
      recognition.onspeechend = () => console.log("🚫 Speech ended");

      recognition.onresult = (event) => {
        console.log("✅ Transcript result:", event);
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        console.error("❌ Recognition error:", event.error);
        reject(`SpeechRecognition error: ${event.error}`);
      };

      recognition.onend = () => console.log("🎤 Listening ended");

      recognition.start();
    } catch (err) {
      console.error("🔥 startListening exception:", err);
      reject(err);
    }
  });
};
