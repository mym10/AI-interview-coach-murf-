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
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] text-[#f4f4f5] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            AI Interview Coach
          </h1>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">
            Practice real technical interview questions with instant AI feedback - built for engineers, by engineers.
          </p>
        </header>

        {/* Input section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1c1e26] border border-[#f59e0b] p-6 rounded-xl shadow-sm">
            <ResumeUploader onUpload={handleResumeUpload} />
          </div>
          <div className="bg-[#1c1e26] border border-[#f59e0b] p-6 rounded-xl shadow-sm">
            <RoleSelector role={role} setRole={setRole} />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-black px-8 py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
