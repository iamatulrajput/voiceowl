'use client';

import { useState } from 'react';
import { apiService, Transcription } from '@/services/api';

interface TranscriptionFormProps {
  onSuccess: (transcription: Transcription) => void;
}

export default function TranscriptionForm({ onSuccess }: TranscriptionFormProps) {
  const [audioUrl, setAudioUrl] = useState('');
  const [useAzure, setUseAzure] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    'en-US', 'en-GB', 'es-ES', 'es-MX',
    'fr-FR', 'de-DE', 'it-IT', 'pt-BR',
    'pt-PT', 'ja-JP', 'ko-KR', 'zh-CN'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const transcription = useAzure
        ? await apiService.createAzureTranscription(audioUrl, language)
        : await apiService.createTranscription(audioUrl);

      onSuccess(transcription);
      setAudioUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transcription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create New Transcription
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Audio URL
          </label>
          <input
            type="url"
            id="audioUrl"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://example.com/audio.mp3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter a valid audio file URL (mp3, wav, etc.)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useAzure"
            checked={useAzure}
            onChange={(e) => setUseAzure(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="useAzure" className="text-sm font-medium text-gray-700">
            Use Azure Speech Service
          </label>
        </div>

        {useAzure && (
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !audioUrl}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Create Transcription'
          )}
        </button>
      </form>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Mock mode creates sample transcriptions instantly. 
          Azure mode requires valid credentials configured in the backend.
        </p>
      </div>
    </div>
  );
}

