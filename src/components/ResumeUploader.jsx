import React from 'react';

// src/components/ResumeUploader.jsx
const ResumeUploader = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div>
      <label>
        Upload your resume (PDF):
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ResumeUploader;