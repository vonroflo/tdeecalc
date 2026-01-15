'use client';

import { useState } from 'react';
import { CalculatorResults, MacroTargets, WeightLossTarget } from '@/types/calculator';
import TDEEChart from './TDEEChart';

interface ResultsDisplayProps {
  results: CalculatorResults;
  onRecalculate: () => void;
  onShare: () => void;
  onTrackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
}

export default function ResultsDisplay({
  results,
  onRecalculate,
  onShare,
  onTrackEvent,
}: ResultsDisplayProps) {
  const [selectedDeficit, setSelectedDeficit] = useState<number>(
    results.weightLossTargets.findIndex((t) => t.isRecommended)
  );
  const [showMacroDetails, setShowMacroDetails] = useState(false);

  const selectedTarget = results.weightLossTargets[selectedDeficit];

  // Recalculate macros for selected deficit
  const getMacrosForTarget = (calories: number): MacroTargets => {
    const proteinGrams = results.macros.protein.grams;
    const proteinCalories = proteinGrams * 4;
    const proteinPercentage = Math.round((proteinCalories / calories) * 100);

    const fatPercentage = 25;
    const fatCalories = Math.round(calories * (fatPercentage / 100));
    const fatGrams = Math.round(fatCalories / 9);

    const carbCalories = calories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);
    const carbPercentage = Math.round((carbCalories / calories) * 100);

    return {
      protein: { grams: proteinGrams, calories: proteinCalories, percentage: proteinPercentage },
      fat: { grams: fatGrams, calories: fatCalories, percentage: fatPercentage },
      carbs: { grams: Math.max(carbGrams, 0), calories: Math.max(carbCalories, 0), percentage: Math.max(carbPercentage, 0) },
    };
  };

  const currentMacros = getMacrosForTarget(selectedTarget.calories);

  const handleDeficitChange = (index: number) => {
    setSelectedDeficit(index);
    onTrackEvent?.('select_deficit', {
      deficit_type: results.weightLossTargets[index].label,
      calories: results.weightLossTargets[index].calories,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main TDEE Result */}
      <section className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">
          Your Daily Energy Expenditure
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white">
            {results.tdee.toLocaleString()}
          </span>
          <span className="text-2xl text-gray-600 dark:text-gray-400">calories/day</span>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          This is your maintenance level — the calories needed to keep your current weight stable.
        </p>
        {results.formulaUsed === 'katch-mcardle' && results.leanBodyMass && (
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
            Calculated using Katch-McArdle (Lean Mass: {results.leanBodyMass} kg)
          </p>
        )}
      </section>

      {/* TDEE Breakdown Chart */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Where Your Calories Go
        </h2>
        <TDEEChart breakdown={results.breakdown} />
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {results.breakdown.bmr.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">BMR (Resting)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {results.breakdown.neat.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Activity</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {results.breakdown.tef.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Digestion (TEF)</p>
          </div>
        </div>
      </section>

      {/* Weight Loss Targets */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Weight Loss Targets
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Choose a calorie target based on how quickly you want to lose weight.
        </p>

        <div className="space-y-3">
          {results.weightLossTargets.map((target: WeightLossTarget, index: number) => (
            <button
              key={target.label}
              onClick={() => handleDeficitChange(index)}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                ${selectedDeficit === index
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }
              `}
              aria-pressed={selectedDeficit === index}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${selectedDeficit === index ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                      {target.label}
                    </span>
                    {target.isRecommended && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300 rounded-full">
                        Recommended
                      </span>
                    )}
                    {target.warning && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-300 rounded-full">
                        Caution
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {target.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-2xl font-bold ${selectedDeficit === index ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                    {target.calories.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    cal/day ({Math.round(target.deficit * 100)}% deficit)
                  </p>
                </div>
              </div>
              {target.warning && selectedDeficit === index && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <span className="font-medium">Note:</span> {target.warning}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            At <strong className="text-gray-900 dark:text-white">{selectedTarget.calories.toLocaleString()} calories/day</strong>,
            you can expect to lose approximately{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {selectedTarget.weeklyLoss} kg ({(selectedTarget.weeklyLoss * 2.2).toFixed(1)} lbs)
            </strong>{' '}
            per week.
          </p>
        </div>
      </section>

      {/* Macro Targets */}
      <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daily Macro Targets
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            for {selectedTarget.calories.toLocaleString()} cal
          </span>
        </div>

        {/* Macro Bar */}
        <div className="h-8 rounded-full overflow-hidden flex mb-4">
          <div
            className="bg-rose-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${currentMacros.protein.percentage}%` }}
          >
            {currentMacros.protein.percentage}%
          </div>
          <div
            className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${currentMacros.fat.percentage}%` }}
          >
            {currentMacros.fat.percentage}%
          </div>
          <div
            className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${currentMacros.carbs.percentage}%` }}
          >
            {currentMacros.carbs.percentage}%
          </div>
        </div>

        {/* Macro Cards */}
        <div className="grid grid-cols-3 gap-4">
          <MacroCard
            name="Protein"
            grams={currentMacros.protein.grams}
            calories={currentMacros.protein.calories}
            color="rose"
            priority
          />
          <MacroCard
            name="Fat"
            grams={currentMacros.fat.grams}
            calories={currentMacros.fat.calories}
            color="amber"
          />
          <MacroCard
            name="Carbs"
            grams={currentMacros.carbs.grams}
            calories={currentMacros.carbs.calories}
            color="blue"
          />
        </div>

        {/* Macro Explanation Toggle */}
        <button
          onClick={() => setShowMacroDetails(!showMacroDetails)}
          className="mt-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-sm"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showMacroDetails ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Why these macros?
        </button>

        {showMacroDetails && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-3 text-sm text-gray-600 dark:text-gray-400 animate-in slide-in-from-top-2 duration-200">
            <p>
              <strong className="text-rose-600 dark:text-rose-400">Protein is prioritized</strong> during weight loss
              to preserve muscle mass and increase satiety. We recommend 2g per kg of body weight.
            </p>
            <p>
              <strong className="text-amber-600 dark:text-amber-400">Fat is set at 25%</strong> to ensure
              adequate hormone production and nutrient absorption.
            </p>
            <p>
              <strong className="text-blue-600 dark:text-blue-400">Carbs fill the remainder</strong> and
              provide energy for your activities and workouts.
            </p>
          </div>
        )}
      </section>

      {/* Safety Note */}
      <section className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Important</p>
            <p>
              These are estimates. If your weight doesn&apos;t change after 2-3 weeks, adjust by 100-200 calories.
              This calculator is not medical advice — consult a healthcare provider for personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRecalculate}
          className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Recalculate
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </button>
      </div>

      {/* Recalculation Reminder */}
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">Pro tip:</span>{' '}
          Recalculate your TDEE every 5-10 lbs lost to keep your targets accurate.
        </p>
      </div>
    </div>
  );
}

interface MacroCardProps {
  name: string;
  grams: number;
  calories: number;
  color: 'rose' | 'amber' | 'blue';
  priority?: boolean;
}

function MacroCard({ name, grams, calories, color, priority }: MacroCardProps) {
  const colorClasses = {
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-1 mb-1">
        <span className="font-medium text-gray-900 dark:text-white">{name}</span>
        {priority && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </div>
      <p className="text-2xl font-bold">{grams}g</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{calories} cal</p>
    </div>
  );
}
