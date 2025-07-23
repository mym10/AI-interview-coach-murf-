import React, { useState } from 'react';
import ResumeUploader from '../components/ResumeUploader';
import RoleSelector from '../components/RoleSelector';
import { parsePDF } from '../utils/pdfParser';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState('');
  const [parsedText, setParsedText] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!resume || !role) {
      alert('Please upload your resume and select a role.');
      return;
    }

    console.log('Resume:', resume);
    console.log('Role:', role);

    navigate('/interview', {
      state: {
        parsedText,
        role,
      },
    });
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
      {parsedText && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
          <h3>Resume Text:</h3>
          <p>{parsedText}</p>
        </div>
      )}
      <button onClick={handleSubmit}>Start Interview</button>
    </div>
  );
};

export default Home;
