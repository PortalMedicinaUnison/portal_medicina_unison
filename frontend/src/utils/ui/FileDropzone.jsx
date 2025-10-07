import React, { useState } from 'react';

const FileDropzone = ({ 
  onFileSelect,
  acceptedFormats,
  maxSizeMB = 5,
  label = 'Haz click para subir o arrastra y suelta',
  sublabel,
  disabled = false
}) => {

  const [error, setError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const validateFile = (file) => {
    if (!file) return false;

    const maxSize = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSize) {
      setError(`El archivo excede el tamaño máximo de ${maxSizeMB}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect?.(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (disabled) return;

    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect?.(file);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-blue-10 hover:bg-blue-50"
          
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
    
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg 
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 16"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>

          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">
              {label}
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {sublabel}
          </p>
        </div>
        
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={acceptedFormats}
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileDropzone;
