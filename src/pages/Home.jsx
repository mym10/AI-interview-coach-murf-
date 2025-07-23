import React, { useState } from 'react';
import ResumeUploader from '../components/ResumeUploader';
import RoleSelector from '../components/RoleSelector';
import { parsePDF } from '../utils/pdfParser';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState('');
  const [parsedText, setParsedText] = useState('');

  const handleSubmit = async () => {
    if (!resume || !role) {
      alert('Please upload your resume and select a role.');
      return;
    }

    console.log('Resume:', resume);
    console.log('Role:', role);
  };

  const handleResumeUpload = async (file) => {
    setResume(file);
    const parsed = await parsePDF(file);
    setParsedText(parsed);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AI Interview Coach</h1>
      <ResumeUploader onUpload={handleResumeUpload} />
      <RoleSelector role={role} setRole={setRole} />
      <button onClick={handleSubmit}>Start Interview</button>
    </div>
  );
};

export default Home;
