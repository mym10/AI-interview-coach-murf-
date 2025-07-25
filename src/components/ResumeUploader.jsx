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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#f4f4f5]">
        Upload your resume <span className="text-[#a1a1aa]">(PDF only)</span>
      </label>

      <div className="relative">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-[#f4f4f5] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2a2d35] file:text-white hover:file:bg-[#33363f] transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default ResumeUploader;