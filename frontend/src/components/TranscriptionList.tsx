'use client';

import { useState, useEffect } from 'react';
import { apiService, Transcription } from '@/services/api';

interface TranscriptionListProps {
  refreshTrigger: number;
}

export default function TranscriptionList({ refreshTrigger }: TranscriptionListProps) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadTranscriptions = async (pageNum: number) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getTranscriptions(pageNum, 10);
      setTranscriptions(response.transcriptions || []);
      setHasMore(response.hasMore || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transcriptions');
      setTranscriptions([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTranscriptions(page);
  }, [page, refreshTrigger]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  if (isLoading && transcriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => loadTranscriptions(page)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Recent Transcriptions (Last 30 Days)
        </h2>
        <button
          onClick={() => loadTranscriptions(page)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {transcriptions.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transcriptions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new transcription above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transcriptions.map((transcription) => (
            <div
              key={transcription._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transcription.source === 'azure'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {transcription.source === 'azure' ? 'Azure' : 'Mock'}
                    </span>
                    {transcription.language && (
                      <span className="text-xs text-gray-500">
                        {transcription.language}
                      </span>
                    )}
                  </div>
                  <a
                    href={transcription.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                    title={transcription.audioUrl}
                  >
                    {truncateUrl(transcription.audioUrl)}
                  </a>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(transcription.createdAt)}
                </span>
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {transcription.transcription}
                </p>
              </div>

              <div className="mt-2 text-xs text-gray-400 font-mono">
                ID: {transcription._id}
              </div>
            </div>
          ))}

          {(page > 1 || hasMore) && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

