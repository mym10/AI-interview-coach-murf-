const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = "8CKmzzdeaOMe1M2XcgrZztp1V65kchY3";

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
      content: `You are a professional AI interviewer conducting a role-specific interview for the position of "${role}". The candidate's resume is provided below.
          Resume: ${resumeText}

          Your task is to ask **one well-structured and relevant interview question at a time**, based on:
          - The candidate's previous answers (chat history),
          - The job role and responsibilities, and
          - The resume provided.

          Focus on depth and clarity. Avoid combining multiple questions into one. Each question should be focused on **one core concept, skill, or experience**. You may ask detailed scenario-based or behavioral questions when relevant, but keep the question logically singular.

          Do not repeat previous questions. Keep the tone professional but conversational.`
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
  return result.trim();
}

// Evaluate answer quality
export async function evaluateAnswer(question, answer, role) {
  const messages = [
    {
      role: 'system',
      content: `You are an AI interviewer evaluating a candidate's answer for the position of "${role}".

      Given a specific interview question and the candidate's response, provide **brief, constructive feedback** that:

      - Points out any weaknesses, missing elements, or vague parts in the answer.
      - Suggests **specific improvements or key points** the candidate could have included.
      - Keeps the feedback **direct and under 4-5 lines**.
      - Always evaluates **in relation to the original question** — do NOT give generic feedback.

      Be concise, helpful, and aligned with what a hiring manager would look for.`,
    },
    {
      role: 'user',
      content: `Question: ${question}\nAnswer: ${answer}`,
    },
  ];

  const result = await callMistral(messages);
  return result.trim();
}
