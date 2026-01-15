'use client';

import { useState, useEffect } from 'react';
import { UserInputs, CalculatorResults } from '@/types/calculator';
import { generateShareableUrl, formatInputsForDisplay } from '@/hooks/useUrlState';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  results: CalculatorResults;
  onTrackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
}

export default function ShareModal({ isOpen, onClose, inputs, results, onTrackEvent }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareableUrl(inputs));
      setCopied(false);
      setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }
  }, [isOpen, inputs]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onTrackEvent?.('share_results', { share_method: 'copy_link' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleCopyText = async () => {
    const text = `My TDEE Results from TDEECalc.io

TDEE: ${results.tdee.toLocaleString()} calories/day
BMR: ${results.bmr.toLocaleString()} calories/day

Weight Loss Targets:
- Mild (-15%): ${results.weightLossTargets[0].calories.toLocaleString()} cal/day
- Moderate (-20%): ${results.weightLossTargets[1].calories.toLocaleString()} cal/day
- Aggressive (-25%): ${results.weightLossTargets[2].calories.toLocaleString()} cal/day

Daily Macros (at ${results.weightLossTargets[1].calories.toLocaleString()} cal):
- Protein: ${results.macros.protein.grams}g
- Fat: ${results.macros.fat.grams}g
- Carbs: ${results.macros.carbs.grams}g

Calculate yours: ${shareUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onTrackEvent?.('share_results', { share_method: 'copy_text' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TDEE Results',
          text: `My daily calorie needs: ${results.tdee.toLocaleString()} calories. Calculate yours!`,
          url: shareUrl,
        });
        onTrackEvent?.('share_results', { share_method: 'native_share' });
      } catch {
        // User cancelled or error
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="share-modal-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Share Your Results
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Share your TDEE calculation or save the link to revisit later.
        </p>

        {/* Results Summary */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {results.tdee.toLocaleString()}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">cal/day</span>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-500">
            {formatInputsForDisplay(inputs)}
          </p>
        </div>

        {/* Share URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shareable Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Actions */}
        <div className="space-y-3">
          <button
            onClick={handleCopyText}
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Copy Full Results as Text
          </button>

          {canShare && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-500">
          The link contains your inputs for easy recalculation later.
        </p>
      </div>
    </div>
  );
}
