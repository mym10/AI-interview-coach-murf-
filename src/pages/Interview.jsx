// pages/Interview.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFollowUpQuestion, evaluateAnswer } from '../utils/mistral';
import { speakWithMurf } from '../utils/murf';
import { startListening } from '../utils/speech';

const MAX_QUESTIONS = 2;

const Interview = () => {
  const location = useLocation();
  const { parsedText, role } = location.state || {};

  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewOver, setInterviewOver] = useState(false);
  const [score, setScore] = useState([]);
  const [status, setStatus] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(1);
  const [queuedAnswer, setQueuedAnswer] = useState(null);

  const firstQuestion = "Let's begin. Can you tell me about yourself?";

  useEffect(() => {
    const runInitialStep = async () => {
      setCurrentQuestion(firstQuestion);
      setChat([{ from: 'ai', text: firstQuestion }]);

      setStatus("Speaking...");
      await speakWithMurf(firstQuestion);
      setStatus("");
      nextCycle();
    };

    runInitialStep();
  }, []);

  useEffect(() => {
    if (!queuedAnswer) return;

    const runQuestionLogic = async () => {
      if (aiQuestionCount >= MAX_QUESTIONS) {
        await endInterview();
        return;
      }

      const updatedChat = [...chat, { from: 'user', text: queuedAnswer }];
      const nextQ = await getFollowUpQuestion(updatedChat, parsedText, role);

      if (nextQ === 'end' || !nextQ.trim()) {
        await endInterview();
        return;
      }

      setChat(prevChat => [...prevChat, { from: 'ai', text: nextQ }]);
      setCurrentQuestion(nextQ);


      setStatus("Speaking...");
      await speakWithMurf(nextQ);
      setStatus("");

      // Only increment count after Murf finishes speaking
      setAiQuestionCount(prev => prev + 1);

      nextCycle();
    };

    runQuestionLogic();
    setQueuedAnswer(null);
  }, [queuedAnswer]);


  const handleSend = async (answer, questionAtTime) => {
    const finalAnswer = answer || userAnswer;
    if (!finalAnswer.trim()) return;

    console.log("📝 Evaluating:");
    console.log("  Question:", questionAtTime);
    console.log("  Answer:", finalAnswer);

    setChat(prev => [...prev, { from: 'user', text: finalAnswer }]);
    setUserAnswer('');

    const feedback = await evaluateAnswer(questionAtTime, finalAnswer, role);
    console.log("  Feedback:", feedback);

    setScore(prev => [...prev, { question: questionAtTime, feedback }]);
    setQueuedAnswer(finalAnswer);
  };

  const nextCycle = async () => {
    setStatus('Listening...');
    const questionAtTime = currentQuestion;

    try {
      const transcript = await startListening();
      setStatus('');
      setUserAnswer(transcript);
      await handleSend(transcript, questionAtTime);

    } catch (err) {
      setStatus('Trying to Listen ...');
    }
  };

  const endInterview = async () => {
    const finalMsg = 'Great! That wraps up our interview. Here’s your feedback:';
    setInterviewOver(true);
    setCurrentQuestion('');
    setChat(prev => [...prev, { from: 'ai', text: finalMsg }]);
    await speakWithMurf(finalMsg);
    setStatus("");
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
        {/* {!interviewOver && (
          <div className="space-y-3">
            <textarea
              disabled
              rows={3}
              placeholder="Type your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full bg-[#1c1e26] text-[#f4f4f5] border border-[#2e2e32] rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
            />
          </div>
        )} */}


        {/* Feedback Summary */}
        {interviewOver && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Feedback Summary</h3>
            <ul className="list-disc list-inside space-y-2 text-[#a1a1aa]">
              {score.map((s, i) => (
                <li key={i+1}>
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
