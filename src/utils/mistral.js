const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

// A helper to call Mistral
async function callMistral(messages) {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-small', // or mistral-medium
      messages: messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Get follow-up question
export async function getFollowUpQuestion(chatHistory, resumeText, role) {
  const chatMessages = [
    {
      role: 'system',
      content: `You are an AI interviewer. Ask the user one interview question at a time based on their role (${role}) and their resume. Resume: ${resumeText}`,
    },
    ...chatHistory.map(entry => ({
      role: entry.from === 'ai' ? 'assistant' : 'user',
      content: entry.text,
    })),
    {
      role: 'user',
      content: 'What is the next question?',
    },
  ];

  const result = await callMistral(chatMessages);

  // Optional: you can decide when to end the interview
  if (chatHistory.length > 5) return 'end';

  return result.trim();
}

// Evaluate answer quality
export async function evaluateAnswer(question, answer, role) {
  const messages = [
    {
      role: 'system',
      content: `You are an AI interviewer evaluating a candidate's answer for a ${role} position. Give brief constructive feedback.`,
    },
    {
      role: 'user',
      content: `Question: ${question}\nAnswer: ${answer}`,
    },
  ];

  const result = await callMistral(messages);
  return result.trim();
}