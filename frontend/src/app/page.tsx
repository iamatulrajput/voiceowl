'use client';

import { useState } from 'react';
import TranscriptionForm from '@/components/TranscriptionForm';
import TranscriptionList from '@/components/TranscriptionList';
import ConnectionStatus from '@/components/ConnectionStatus';
import { Transcription } from '@/services/api';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTranscriptionSuccess = (transcription: Transcription) => {
    // Show success message (you can add a toast notification here)
    console.log('Transcription created:', transcription);
    
    // Trigger refresh of the transcription list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ConnectionStatus />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            VoiceOwl
          </h1>
          <p className="text-xl text-gray-600">
            Audio Transcription Service
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Azure Speech Service & MongoDB
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <TranscriptionForm onSuccess={handleTranscriptionSuccess} />
            
            {/* Info Cards */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mock transcription for testing
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Azure Speech Service integration
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Multi-language support (12 languages)
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Automatic retry with exponential backoff
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Optimized for 100M+ records
                </li>
              </ul>
            </div>

            {/* API Endpoints */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                API Endpoints
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                    POST
                  </span>
                  <code className="text-gray-600">/api/transcription</code>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                    POST
                  </span>
                  <code className="text-gray-600">/api/azure-transcription</code>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">
                    GET
                  </span>
                  <code className="text-gray-600">/api/transcriptions</code>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">
                    GET
                  </span>
                  <code className="text-gray-600">/api/transcription/:id</code>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - List */}
          <div>
            <TranscriptionList refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Built with Next.js, TypeScript, Tailwind CSS, Express, and MongoDB
          </p>
          <p className="mt-1">
            Backend API running on{' '}
            <a
              href="http://localhost:5000/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              http://localhost:5000
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
