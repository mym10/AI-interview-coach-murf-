# 🎙️ AI Interview Coach

An intelligent, voice-based interview simulation app powered by Murf and Mistral APIs. This desktop + web app allows users to upload their resume, select a job role, and engage in an interactive mock interview — all while receiving personalized, real-time feedback.<br>
> Live Demo: [https://ai-interview-coach-3mg.onrender.com](https://ai-interview-coach-3mg.onrender.com) 

---

## 💡 Features

- 📝 Upload your resume and select an interview role
- 🎤 Voice-based Q&A interaction using Murf's text-to-speech
- 🧠 Intelligent follow-up questions via Mistral LLM
- 📊 Post-interview analytics and score breakdown
- 💻 Works as both a **desktop app** (Electron) and **web app** (Vite + Express)

---

## 🧱 Tech Stack

| Layer       | Tech                         |
|-------------|------------------------------|
| Frontend    | React, Tailwind CSS, Vite    |
| Backend     | Node.js, Express             |
| AI / TTS    | Mistral API, Murf API        |
| Desktop     | Electron.js                  |
| Others      | Axios, dotenv, path-to-regexp |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/mym10/AI-interview-coach-murf-.git
cd AI-interview-coach-murf-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up .env
Create a .env file in the root directory:
```env
VITE_MISTRAL_API_KEY=your_mistral_api
MURF_API_KEY=your_murf_api_key
PORT=5000
```

### 4. Build Frontend
```bash
npm run build
```

### 5. Run Server
```bash
node src/electron/server.js
```
Visit: http://localhost:5000

## ⚙️ Project Structure
```css
root/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── electron/
│   │   ├── server.js
│   │   ├── main.cjs
│   │   └── preload.js
│   ├── utils/
│   │   ├── murf.js
│   │   ├── mistral.js
│   │   └── pdfParser.js
│   ├── App.jsx
│   ├── main.jsx
├── dist/
├── .env
├── package.json
└── README.md
```

## 🙌 Made With Love
Built for the Murf AI Hackathon<br>
By Mythri Dantu and Gayatri Nayak
