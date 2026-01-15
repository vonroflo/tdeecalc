'use client';

import { useState, useCallback, useRef, Suspense } from 'react';
import { UserInputs, CalculatorResults } from '@/types/calculator';
import { calculateTDEE } from '@/lib/calculator';
import { trackEvent } from '@/lib/analytics';
import { useUrlState } from '@/hooks/useUrlState';
import Header from '@/components/Header';
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

    // On mobile, scroll to results
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
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
      <Header />
      <main className="min-h-screen">
        {/* Compact Hero + Calculator Section - Above the fold */}
        <section id="calculator" className="bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 px-4 pt-6 pb-8">
          <div className="max-w-5xl mx-auto">
            {/* Compact Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                TDEE Calculator
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Calculate your daily calorie needs for sustainable weight loss
              </p>
            </div>

            {/* Calculator Card */}
            {!results ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 lg:p-6">
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

        {/* Education Section - Below the fold */}
        <section className="px-4 py-6 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <EducationSection />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">TDEECalc.io</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Free, science-backed TDEE calculator.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resources</h3>
                <ul className="space-y-1">
                  <li>
                    <a href="#education-heading" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600">
                      Understanding TDEE
                    </a>
                  </li>
                  <li>
                    <a href="#education-heading" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600">
                      Weight Loss FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built for sustainable weight loss.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} TDEECalc.io. Not medical advice.</p>
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
