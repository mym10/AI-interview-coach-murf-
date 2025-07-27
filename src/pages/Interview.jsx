// pages/Interview.jsx
import React, { useState, useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';
import { getFollowUpQuestion, evaluateAnswer } from '../utils/mistral';
import { speakWithMurf } from '../utils/murf';



const Interview = () => {
  const location = useLocation();
  const { parsedText, role } = location.state || {};
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);


  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewOver, setInterviewOver] = useState(false);
  const [score, setScore] = useState([]);

  // Predefined first question
  const firstQuestion = "Let's begin. Can you tell me about yourself?";

  useEffect(() => {
    setCurrentQuestion(firstQuestion);
    setChat([{ from: 'ai', text: firstQuestion }]);
    speakWithMurf(firstQuestion);
  }, []);
 useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported in this browser');
    return;
  }

  const recognition = new SpeechRecognition();
  recognitionRef.current = recognition;

  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spokenText = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ');
    console.log('🎤 User said:', spokenText);
    setUserAnswer(spokenText);
    setListening(false); // Optional: auto-stop after one input
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setListening(false);
  };

  if (listening) {
    recognition.start();
    console.log('🎙️ Listening started...');
  } else {
    recognition.stop();
    console.log('🛑 Listening stopped.');
  }

  return () => {
    recognition.stop();
  };
}, [listening]);



  const handleSend = async () => {
    if (listening) {
    recognitionRef.current?.stop();
    setListening(false);
  }

    if (!userAnswer.trim()) return;

    // Save user response
    const newChat = [...chat, { from: 'user', text: userAnswer }];
    setChat(newChat);
    setUserAnswer('');

    // Evaluate this answer (optional)
    const feedback = await evaluateAnswer(currentQuestion, userAnswer, role);
    setScore(prev => [...prev, { question: currentQuestion, feedback }]);

    // Get next question
    const nextQ = await getFollowUpQuestion(newChat, parsedText, role);

    if (nextQ === 'end') {
      setInterviewOver(true);
      const finalMsg = 'Great! That wraps up our interview. Here’s your feedback:';
      setCurrentQuestion('');
      setChat([...newChat, { from: 'ai', text: finalMsg }]);
      speakWithMurf(finalMsg);
    } else {
      setCurrentQuestion(nextQ);
      setChat([...newChat, { from: 'ai', text: nextQ }]);
      speakWithMurf(nextQ);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0e0e10] text-[#f4f4f5] px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">

        {/* Header */}
        <h2 className="text-2xl font-semibold">
          Interview for: <span className="text-[#fbbf24]">{role}</span>
        </h2>

        {/* Chat Window */}
        <div className="bg-[#1c1e26] border border-[#2e2e32] rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-3">
          {chat.map((entry, idx) => (
            <p key={idx} className={`text-sm leading-relaxed ${entry.from === 'ai' ? 'text-white' : 'text-[#22c55e]'}`}>
              <strong>{entry.from === 'ai' ? 'AI: ' : 'You: '}</strong> {entry.text}
            </p>
          ))}
        </div>

        {/* Answer Input */}
        {!interviewOver && (
          <div className="flex gap-4">
            <button
             onClick={() => {
                  if (!listening) setListening(true);
                 }}
                   className={`bg-[#22c55e] hover:bg-[#16a34a] text-black px-6 py-2 rounded-md font-medium transition-all ${listening ? 'animate-pulse' : ''}`}
                 >
                  🎙️ Speak
               </button>

            <button
              onClick={handleSend}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-black px-6 py-2 rounded-md font-medium transition-all"
            >
              Send
            </button>
          </div>
        )}

        {/* Feedback Summary */}
        {interviewOver && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Feedback Summary</h3>
            <ul className="list-disc list-inside space-y-2 text-[#a1a1aa]">
              {score.map((s, i) => (
                <li key={i}>
                  <strong className="text-white">{s.question}</strong>: {s.feedback}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;
