export const startListening = () => {
  return new Promise((resolve, reject) => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        return reject("SpeechRecognition API not supported");
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true; // Allow extended listening

      let finalTranscript = '';
      let silenceTimer;
      const SILENCE_THRESHOLD = 4000; // 4 sec of silence = done

      recognition.onstart = () => console.log("Listening started...");
      recognition.onaudiostart = () => console.log("Audio capture started");
      recognition.onspeechstart = () => console.log("Speech detected");

      recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        console.log("User speaking:", finalTranscript + interimTranscript);

        // Reset timer — user is still talking
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          if (finalTranscript.trim()) {
            console.log("User finished:", finalTranscript.trim());
            recognition.stop(); 
            resolve(finalTranscript.trim());
          }
        }, SILENCE_THRESHOLD);
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        reject(`SpeechRecognition error: ${event.error}`);
      };

      recognition.onend = () => console.log("🎤 Listening ended");

      recognition.start();
    } catch (err) {
      console.error("startListening exception:", err);
      reject(err);
    }
  });
};
