// pages/Interview.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFollowUpQuestion, evaluateAnswer } from '../utils/mistral';
import { speakWithMurf } from '../utils/murf';


const Interview = () => {
  const location = useLocation();
  const { parsedText, role } = location.state || {};

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
    // speakWithMurf(firstQuestion);
  }, []);

  const handleSend = async () => {
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
    //   speakWithMurf(finalMsg);
    } else {
      setCurrentQuestion(nextQ);
      setChat([...newChat, { from: 'ai', text: nextQ }]);
    //   speakWithMurf(nextQ);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Interview for: {role}</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {chat.map((entry, idx) => (
          <p key={idx} style={{ color: entry.from === 'ai' ? 'white' : 'green' }}>
            <strong>{entry.from === 'ai' ? 'AI: ' : 'You: '}</strong>{entry.text}
          </p>
        ))}
      </div>
      {!interviewOver && (
        <div style={{ marginTop: '1rem' }}>
          <textarea
            rows={3}
            placeholder="Type your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            style={{ width: '100%' }}
          />
          <button onClick={handleSend} style={{ marginTop: '0.5rem' }}>Send</button>
        </div>
      )}
      {interviewOver && (
        <div>
          <h3>Feedback Summary</h3>
          <ul>
            {score.map((s, i) => (
              <li key={i}><strong>{s.question}</strong>: {s.feedback}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Interview;
