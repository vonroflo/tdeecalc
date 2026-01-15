export type Sex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very_active'
  | 'extra_active';

export type UnitSystem = 'metric' | 'imperial';

export interface UserInputs {
  sex: Sex;
  age: number;
  height: number; // Always stored in cm
  weight: number; // Always stored in kg
  activityLevel: ActivityLevel;
  bodyFatPercentage?: number;
  unitSystem: UnitSystem;
}

export interface TDEEBreakdown {
  bmr: number;
  neat: number; // Non-exercise activity thermogenesis
  tef: number;  // Thermic effect of food
  total: number;
}

export interface WeightLossTarget {
  label: string;
  deficit: number;
  calories: number;
  weeklyLoss: number; // kg per week
  description: string;
  isRecommended?: boolean;
  warning?: string;
}

export interface MacroTargets {
  protein: { grams: number; calories: number; percentage: number };
  fat: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
}

export interface CalculatorResults {
  tdee: number;
  bmr: number;
  breakdown: TDEEBreakdown;
  weightLossTargets: WeightLossTarget[];
  macros: MacroTargets;
  formulaUsed: 'mifflin-st-jeor' | 'katch-mcardle';
  leanBodyMass?: number;
}

export interface ActivityLevelInfo {
  value: ActivityLevel;
  label: string;
  multiplier: number;
  description: string;
  examples: string[];
}

export const ACTIVITY_LEVELS: ActivityLevelInfo[] = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    multiplier: 1.2,
    description: 'Little or no exercise, desk job',
    examples: ['Office work with minimal walking', 'Mostly sitting throughout the day']
  },
  {
    value: 'light',
    label: 'Lightly Active',
    multiplier: 1.375,
    description: 'Light exercise 1-3 days/week',
    examples: ['Walking 30 min/day', '1-3 gym sessions per week']
  },
  {
    value: 'moderate',
    label: 'Moderately Active',
    multiplier: 1.55,
    description: 'Moderate exercise 3-5 days/week',
    examples: ['Regular gym-goer', 'Active job with some physical activity']
  },
  {
    value: 'very_active',
    label: 'Very Active',
    multiplier: 1.725,
    description: 'Hard exercise 6-7 days/week',
    examples: ['Daily intense workouts', 'Training for competition']
  },
  {
    value: 'extra_active',
    label: 'Extra Active',
    multiplier: 1.9,
    description: 'Very hard exercise & physical job',
    examples: ['Professional athlete', 'Physical labor job + daily training']
  }
];
