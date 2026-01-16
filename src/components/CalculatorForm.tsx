'use client';

import { useState, useCallback } from 'react';
import {
  Sex,
  ActivityLevel,
  UnitSystem,
  UserInputs,
  ACTIVITY_LEVELS,
} from '@/types/calculator';
import {
  lbsToKg,
  feetInchesToCm,
  validateInputs,
} from '@/lib/calculator';

interface CalculatorFormProps {
  onCalculate: (inputs: UserInputs) => void;
  onTrackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
}

export default function CalculatorForm({ onCalculate, onTrackEvent }: CalculatorFormProps) {
  const [sex, setSex] = useState<Sex | ''>('');
  const [age, setAge] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightLbs, setWeightLbs] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('');
  const [showBodyFat, setShowBodyFat] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    let height: number;
    let weight: number;

    if (unitSystem === 'imperial') {
      height = feetInchesToCm(
        parseFloat(heightFeet) || 0,
        parseFloat(heightInches) || 0
      );
      weight = lbsToKg(parseFloat(weightLbs) || 0);
    } else {
      height = parseFloat(heightCm) || 0;
      weight = parseFloat(weightKg) || 0;
    }

    const inputs: Partial<UserInputs> = {
      sex: sex as Sex,
      age: parseInt(age) || 0,
      height,
      weight,
      activityLevel: activityLevel as ActivityLevel,
      bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : undefined,
      unitSystem,
    };

    const validationErrors = validateInputs(inputs);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      onTrackEvent?.('calculation_error', { errors: validationErrors });
      return;
    }

    setErrors([]);
    onTrackEvent?.('calculate_tdee', {
      sex,
      activity_level: activityLevel,
      unit_system: unitSystem,
      has_body_fat: !!bodyFatPercentage,
    });
    onCalculate(inputs as UserInputs);
  }, [sex, age, unitSystem, heightFeet, heightInches, heightCm, weightLbs, weightKg, activityLevel, bodyFatPercentage, onCalculate, onTrackEvent]);

  return (
    <form onSubmit={handleSubmit} aria-label="TDEE Calculator Form">
      {/* Desktop: Two column layout, Mobile: Single column */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Personal Info */}
        <div className="space-y-4">
          {/* Sex Selection - Full width, 50/50 split */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Biological Sex
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(['male', 'female'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSex(option)}
                  className={`
                    py-2.5 rounded-lg border-2 font-medium text-sm transition-all
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
                    ${sex === option
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                    }
                  `}
                  aria-pressed={sex === option}
                >
                  {option === 'male' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Age + Units Row - Side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age Input */}
            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="15"
                max="100"
                placeholder="Years"
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Unit System Toggle - Full width buttons */}
            <div>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Units
              </span>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                {(['imperial', 'metric'] as const).map((system) => (
                  <button
                    key={system}
                    type="button"
                    onClick={() => setUnitSystem(system)}
                    className={`
                      py-2 rounded-md text-sm font-medium transition-all
                      focus:outline-none focus:ring-2 focus:ring-emerald-500
                      ${unitSystem === system
                        ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'
                      }
                    `}
                    aria-pressed={unitSystem === system}
                  >
                    {system === 'imperial' ? 'ft / lb' : 'cm / kg'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Height & Weight - Side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Height
              </label>
              {unitSystem === 'imperial' ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    min="3"
                    max="8"
                    placeholder="ft"
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    min="0"
                    max="11"
                    placeholder="in"
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              ) : (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  min="100"
                  max="250"
                  placeholder="cm"
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Weight
              </label>
              {unitSystem === 'imperial' ? (
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  min="66"
                  max="660"
                  step="0.1"
                  placeholder="lbs"
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              ) : (
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  min="30"
                  max="300"
                  step="0.1"
                  placeholder="kg"
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              )}
            </div>
          </div>

          {/* Optional Body Fat */}
          <div>
            <button
              type="button"
              onClick={() => setShowBodyFat(!showBodyFat)}
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showBodyFat ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Body fat % (optional)
            </button>
            {showBodyFat && (
              <div className="mt-2">
                <input
                  type="number"
                  value={bodyFatPercentage}
                  onChange={(e) => setBodyFatPercentage(e.target.value)}
                  min="3"
                  max="60"
                  step="0.1"
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Activity Level */}
        <div>
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Activity Level
              <span className="font-normal text-gray-500 dark:text-gray-400 ml-1">(typical week)</span>
            </legend>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setActivityLevel(level.value)}
                  className={`
                    w-full px-3 py-2.5 rounded-lg border-2 text-left transition-all
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
                    ${activityLevel === level.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }
                  `}
                  aria-pressed={activityLevel === level.value}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`font-medium text-sm ${activityLevel === level.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                        {level.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {level.description}
                      </span>
                    </div>
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                      ${activityLevel === level.value
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300 dark:border-gray-600'
                      }
                    `}>
                      {activityLevel === level.value && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800" role="alert">
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 dark:text-red-300 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="
          w-full mt-6 py-3 px-6 rounded-xl bg-emerald-600 text-white font-semibold text-base
          hover:bg-emerald-700 active:bg-emerald-800
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          transition-all shadow-lg shadow-emerald-500/25
        "
      >
        Calculate My TDEE
      </button>
    </form>
  );
}
