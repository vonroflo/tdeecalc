'use client';

import { useState, useCallback, useRef, Suspense } from 'react';
import { UserInputs, CalculatorResults } from '@/types/calculator';
import { calculateTDEE } from '@/lib/calculator';
import { trackEvent } from '@/lib/analytics';
import { useUrlState } from '@/hooks/useUrlState';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import EducationSection from '@/components/EducationSection';
import ShareModal from '@/components/ShareModal';

function Calculator() {
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [currentInputs, setCurrentInputs] = useState<UserInputs | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { updateUrl } = useUrlState();

  const handleCalculate = useCallback((inputs: UserInputs) => {
    const calculatedResults = calculateTDEE(inputs);
    setResults(calculatedResults);
    setCurrentInputs(inputs);
    updateUrl(inputs);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [updateUrl]);

  const handleRecalculate = useCallback(() => {
    setResults(null);
    setCurrentInputs(null);
    trackEvent('recalculate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
    trackEvent('open_share_modal');
  }, []);

  const handleTrackEvent = useCallback((eventName: string, params?: Record<string, unknown>) => {
    trackEvent(eventName, params);
  }, []);

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 pt-12 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              TDEE Calculator
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-2">
              Calculate Your Daily Calorie Needs for Weight Loss
            </p>
            <p className="text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
              Get your personalized Total Daily Energy Expenditure (TDEE), weight loss calorie targets,
              and macro recommendations — all backed by science.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="px-4 py-12 -mt-8">
          <div className="max-w-xl mx-auto">
            {!results ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <CalculatorForm onCalculate={handleCalculate} onTrackEvent={handleTrackEvent} />
              </div>
            ) : (
              <div ref={resultsRef}>
                <ResultsDisplay
                  results={results}
                  onRecalculate={handleRecalculate}
                  onShare={handleShare}
                  onTrackEvent={handleTrackEvent}
                />
              </div>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <EducationSection />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">TDEECalc.io</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Free, science-backed TDEE calculator with personalized weight loss guidance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#education-heading" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                      Understanding TDEE
                    </a>
                  </li>
                  <li>
                    <a href="#education-heading" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                      Weight Loss FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built to help people lose weight sustainably with clear, actionable guidance.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-500">
              <p>&copy; {new Date().getFullYear()} TDEECalc.io. All rights reserved.</p>
              <p className="mt-2">
                This calculator provides estimates for educational purposes only. Not medical advice.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Share Modal */}
      {currentInputs && results && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          inputs={currentInputs}
          results={results}
          onTrackEvent={handleTrackEvent}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <Calculator />
    </Suspense>
  );
}
