// pages/Interview.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFollowUpQuestion, evaluateAnswer } from '../utils/mistral';
import { speakWithMurf } from '../utils/murf';
import { startListening } from '../utils/speech';
const MAX_QUESTIONS = 4;

const Interview = () => {
  const location = useLocation();
  const { parsedText, role } = location.state || {};

  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewOver, setInterviewOver] = useState(false);
  const [score, setScore] = useState([]);
  const [status, setStatus] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(1);

  const firstQuestion = "Let's begin. Can you tell me about yourself?";

  useEffect(() => {
    const runInitialStep = async () => {
      setCurrentQuestion(firstQuestion);
      setChat([{ from: 'ai', text: firstQuestion }]);
      await speakWithMurf(firstQuestion);
      setStatus('Listening...');
      const transcript = await startListening();
      setStatus('');
      setUserAnswer(transcript);
      await handleSend(transcript); // starts once
    };

    runInitialStep();
  }, []);

  const handleSend = async (answer) => {
    const finalAnswer = answer || userAnswer;
    if (!finalAnswer.trim()) return;

    setChat(prev => [...prev, { from: 'user', text: finalAnswer }]);
    setUserAnswer('');

    const feedback = await evaluateAnswer(currentQuestion, finalAnswer, role);
    setScore(prev => [...prev, { question: currentQuestion, feedback }]);

    const newCount = aiQuestionCount + 1;
    setAiQuestionCount(newCount);

    if (newCount >= MAX_QUESTIONS) {
      const finalMsg = 'Great! That wraps up our interview. Here’s your feedback:';
      setInterviewOver(true);
      setCurrentQuestion('');
      setChat(prev => [...prev, { from: 'ai', text: finalMsg }]);
      await speakWithMurf(finalMsg);
      return;
    }

    const nextQ = await getFollowUpQuestion(chat, parsedText, role, newCount);

    if (nextQ === 'end') {
      const finalMsg = 'Great! That wraps up our interview. Here’s your feedback:';
      setInterviewOver(true);
      setCurrentQuestion('');
      setChat(prev => [...prev, { from: 'ai', text: finalMsg }]);
      await speakWithMurf(finalMsg);
      return;
    }

    setCurrentQuestion(nextQ);
    setChat(prev => [...prev, { from: 'ai', text: nextQ }]);

    setStatus('Speaking...');
    await speakWithMurf(nextQ);

    setStatus('Listening...');
    const transcript = await startListening();
    setStatus('');
    setUserAnswer(transcript);

    // Safe check before sending next
    if (newCount <= MAX_QUESTIONS) {
      await handleSend(transcript);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0e0e10] text-[#f4f4f5] px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">

        {/* Header */}
        <h2 className="text-2xl font-semibold">
          Interview for: <span className="text-[#fbbf24]">{role}</span>
        </h2>

        {/* staus */}
        {status && <p className="text-sm italic text-gray-500 mt-2">{status}</p>}

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
          <div className="space-y-3">
            <textarea
              disabled
              rows={3}
              placeholder="Type your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full bg-[#1c1e26] text-[#f4f4f5] border border-[#2e2e32] rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
            />
            <button
              disabled
              className="bg-[#f59e0b] hover:bg-[#d97706] text-black px-6 py-2 rounded-md font-medium transition-all"
            >
             Listening...
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
