'use client';

import { useState } from 'react';
import { XMarkIcon, LinkIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Survey } from '@/types/survey';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: Survey | null;
}

export default function ShareLinkModal({ isOpen, onClose, survey }: ShareLinkModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !survey) return null;

  const surveyUrl = `${window.location.origin}/survey/${survey.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bagikan Link Survei</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <LinkIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">{survey.title}</span>
            </div>
            <p className="text-sm text-blue-700">{survey.description}</p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Survei:
          </label>
          <div className="flex">
            <input
              type="text"
              value={surveyUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-1 inline" />
                  Tersalin!
                </>
              ) : (
                <>
                  <ClipboardIcon className="h-4 w-4 mr-1 inline" />
                  Salin
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Link ini dapat dibagikan kepada responden untuk mengisi survei. 
            Pastikan survei dalam status &quot;Aktif&quot; agar dapat diakses.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
} 