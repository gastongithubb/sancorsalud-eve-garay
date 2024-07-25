// app/components/BalanceMensual/FileUploadComponent.tsx
'use client';

import React, { useState } from 'react';
import UploadedFilesTable from './UploadedFilesTable';

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTable, setRefreshTable] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/process-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess('File processed successfully');
      console.log('File processed successfully:', result);
      setRefreshTable(prev => !prev); // Toggle to trigger table refresh
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PDF or Image (MAX. 10MB)</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
          </label>
        </div>
        {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={isLoading || !file}
        >
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
      <UploadedFilesTable key={refreshTable.toString()} />
    </div>
  );
};

export default FileUploadComponent;