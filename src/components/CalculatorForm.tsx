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
  // Form state
  const [sex, setSex] = useState<Sex | ''>('');
  const [age, setAge] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');

  // Height state (imperial)
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');
  // Height state (metric)
  const [heightCm, setHeightCm] = useState<string>('');

  // Weight state
  const [weightLbs, setWeightLbs] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');

  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('');
  const [showBodyFat, setShowBodyFat] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Convert to metric for calculations
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

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="TDEE Calculator Form">
      {/* Sex Selection */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-gray-900 dark:text-white">
          Biological Sex
        </legend>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Used for metabolic calculations
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(['male', 'female'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSex(option)}
              className={`
                px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                ${sex === option
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                }
              `}
              aria-pressed={sex === option}
            >
              {option === 'male' ? 'Male' : 'Female'}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Age Input */}
      <div className="space-y-2">
        <label htmlFor="age" className="block text-lg font-semibold text-gray-900 dark:text-white">
          Age
        </label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onBlur={() => handleFieldBlur('age')}
          min="15"
          max="100"
          placeholder="Enter your age"
          className={`
            w-full px-4 py-3 rounded-xl border-2 text-lg
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            dark:bg-gray-800 dark:text-white
            ${touched.age && (!age || parseInt(age) < 15 || parseInt(age) > 100)
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-200 dark:border-gray-700'
            }
          `}
          aria-describedby="age-description"
        />
        <p id="age-description" className="text-sm text-gray-500 dark:text-gray-400">
          Years old (15-100)
        </p>
      </div>

      {/* Unit System Toggle */}
      <div className="space-y-3">
        <span className="block text-lg font-semibold text-gray-900 dark:text-white">
          Unit System
        </span>
        <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {(['imperial', 'metric'] as const).map((system) => (
            <button
              key={system}
              type="button"
              onClick={() => setUnitSystem(system)}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500
                ${unitSystem === system
                  ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }
              `}
              aria-pressed={unitSystem === system}
            >
              {system === 'imperial' ? 'Imperial (ft/lb)' : 'Metric (cm/kg)'}
            </button>
          ))}
        </div>
      </div>

      {/* Height Input */}
      <div className="space-y-2">
        <label className="block text-lg font-semibold text-gray-900 dark:text-white">
          Height
        </label>
        {unitSystem === 'imperial' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                onBlur={() => handleFieldBlur('height')}
                min="3"
                max="8"
                placeholder="Feet"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                aria-label="Height in feet"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">feet</span>
            </div>
            <div>
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                onBlur={() => handleFieldBlur('height')}
                min="0"
                max="11"
                placeholder="Inches"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                aria-label="Height in inches"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">inches</span>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              onBlur={() => handleFieldBlur('height')}
              min="100"
              max="250"
              placeholder="Enter height in cm"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              aria-label="Height in centimeters"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">centimeters</span>
          </div>
        )}
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <label className="block text-lg font-semibold text-gray-900 dark:text-white">
          Current Weight
        </label>
        {unitSystem === 'imperial' ? (
          <div>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              onBlur={() => handleFieldBlur('weight')}
              min="66"
              max="660"
              step="0.1"
              placeholder="Enter weight in lbs"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              aria-label="Weight in pounds"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">pounds (lbs)</span>
          </div>
        ) : (
          <div>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              onBlur={() => handleFieldBlur('weight')}
              min="30"
              max="300"
              step="0.1"
              placeholder="Enter weight in kg"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              aria-label="Weight in kilograms"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">kilograms (kg)</span>
          </div>
        )}
      </div>

      {/* Activity Level */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Level
        </legend>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose what matches most weeks, not your best week.
        </p>
        <div className="space-y-3">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setActivityLevel(level.value)}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                ${activityLevel === level.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }
              `}
              aria-pressed={activityLevel === level.value}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`font-semibold ${activityLevel === level.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                    {level.label}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {level.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {level.examples.join(' • ')}
                  </p>
                </div>
                <span className={`
                  w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1
                  ${activityLevel === level.value
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {activityLevel === level.value && (
                    <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Optional Body Fat */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowBodyFat(!showBodyFat)}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
        >
          <svg
            className={`w-5 h-5 transition-transform ${showBodyFat ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Advanced: Add body fat % for more accuracy
        </button>

        {showBodyFat && (
          <div className="pl-7 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <input
              type="number"
              value={bodyFatPercentage}
              onChange={(e) => setBodyFatPercentage(e.target.value)}
              min="3"
              max="60"
              step="0.1"
              placeholder="Body fat percentage (optional)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              aria-label="Body fat percentage"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If provided, we&apos;ll use the Katch-McArdle formula for better accuracy.
            </p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800" role="alert">
          <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">Please fix the following:</h3>
          <ul className="list-disc list-inside space-y-1">
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
          w-full py-4 px-6 rounded-xl bg-emerald-600 text-white font-semibold text-lg
          hover:bg-emerald-700 active:bg-emerald-800
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          transition-all duration-200 shadow-lg shadow-emerald-500/30
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Calculate My TDEE
      </button>
    </form>
  );
}
