import {
  UserInputs,
  CalculatorResults,
  TDEEBreakdown,
  WeightLossTarget,
  MacroTargets,
  ACTIVITY_LEVELS,
} from '@/types/calculator';

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * Most accurate for general population
 */
function calculateMifflinStJeorBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  sex: 'male' | 'female'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

/**
 * Calculate BMR using Katch-McArdle equation
 * More accurate when body fat percentage is known
 */
function calculateKatchMcArdleBMR(leanBodyMass: number): number {
  return 370 + 21.6 * leanBodyMass;
}

/**
 * Calculate lean body mass from total weight and body fat percentage
 */
function calculateLeanBodyMass(weight: number, bodyFatPercentage: number): number {
  return weight * (1 - bodyFatPercentage / 100);
}

/**
 * Get activity multiplier for given activity level
 */
function getActivityMultiplier(activityLevel: UserInputs['activityLevel']): number {
  const level = ACTIVITY_LEVELS.find((l) => l.value === activityLevel);
  return level?.multiplier ?? 1.2;
}

/**
 * Calculate TDEE breakdown showing BMR, NEAT, and TEF components
 */
function calculateTDEEBreakdown(bmr: number, tdee: number): TDEEBreakdown {
  const tef = Math.round(tdee * 0.1); // 10% of TDEE for thermic effect of food
  const neat = tdee - bmr - tef; // Remaining is activity

  return {
    bmr: Math.round(bmr),
    neat: Math.round(neat),
    tef,
    total: Math.round(tdee),
  };
}

/**
 * Calculate weight loss calorie targets
 */
function calculateWeightLossTargets(tdee: number): WeightLossTarget[] {
  const minCalories = 1200; // Absolute minimum for safety

  return [
    {
      label: 'Mild Deficit',
      deficit: 0.15,
      calories: Math.max(Math.round(tdee * 0.85), minCalories),
      weeklyLoss: 0.25,
      description: 'Slow and sustainable. Easier to maintain, less muscle loss.',
    },
    {
      label: 'Moderate Deficit',
      deficit: 0.20,
      calories: Math.max(Math.round(tdee * 0.80), minCalories),
      weeklyLoss: 0.45,
      description: 'Optimal balance of results and sustainability.',
      isRecommended: true,
    },
    {
      label: 'Aggressive Deficit',
      deficit: 0.25,
      calories: Math.max(Math.round(tdee * 0.75), minCalories),
      weeklyLoss: 0.7,
      description: 'Faster results but harder to maintain.',
      warning: 'Recommended for short-term use only (4-8 weeks). Higher risk of muscle loss and metabolic adaptation.',
    },
  ];
}

/**
 * Calculate macro targets optimized for weight loss
 * Prioritizes protein for muscle preservation and satiety
 */
function calculateMacros(
  targetCalories: number,
  weight: number,
  leanBodyMass?: number
): MacroTargets {
  // Protein: 1.6-2.2g per kg of body weight (or lean mass if available)
  // Using 2g/kg for weight loss to maximize muscle preservation
  const proteinBase = leanBodyMass ?? weight;
  const proteinGrams = Math.round(proteinBase * 2.0);
  const proteinCalories = proteinGrams * 4;
  const proteinPercentage = Math.round((proteinCalories / targetCalories) * 100);

  // Fat: 25-30% of calories (essential for hormones)
  const fatPercentage = 25;
  const fatCalories = Math.round(targetCalories * (fatPercentage / 100));
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: remainder
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);
  const carbPercentage = Math.round((carbCalories / targetCalories) * 100);

  return {
    protein: {
      grams: proteinGrams,
      calories: proteinCalories,
      percentage: proteinPercentage,
    },
    fat: {
      grams: fatGrams,
      calories: fatCalories,
      percentage: fatPercentage,
    },
    carbs: {
      grams: Math.max(carbGrams, 0),
      calories: Math.max(carbCalories, 0),
      percentage: Math.max(carbPercentage, 0),
    },
  };
}

/**
 * Main calculator function
 * Takes user inputs and returns comprehensive results
 */
export function calculateTDEE(inputs: UserInputs): CalculatorResults {
  let bmr: number;
  let formulaUsed: CalculatorResults['formulaUsed'];
  let leanBodyMass: number | undefined;

  // Determine which formula to use
  if (inputs.bodyFatPercentage && inputs.bodyFatPercentage > 0) {
    leanBodyMass = calculateLeanBodyMass(inputs.weight, inputs.bodyFatPercentage);
    bmr = calculateKatchMcArdleBMR(leanBodyMass);
    formulaUsed = 'katch-mcardle';
  } else {
    bmr = calculateMifflinStJeorBMR(
      inputs.weight,
      inputs.height,
      inputs.age,
      inputs.sex
    );
    formulaUsed = 'mifflin-st-jeor';
  }

  // Calculate TDEE
  const activityMultiplier = getActivityMultiplier(inputs.activityLevel);
  const tdee = bmr * activityMultiplier;

  // Calculate breakdown
  const breakdown = calculateTDEEBreakdown(bmr, tdee);

  // Calculate weight loss targets
  const weightLossTargets = calculateWeightLossTargets(tdee);

  // Calculate macros for recommended deficit
  const recommendedTarget = weightLossTargets.find((t) => t.isRecommended);
  const targetCalories = recommendedTarget?.calories ?? Math.round(tdee * 0.8);
  const macros = calculateMacros(targetCalories, inputs.weight, leanBodyMass);

  return {
    tdee: Math.round(tdee),
    bmr: Math.round(bmr),
    breakdown,
    weightLossTargets,
    macros,
    formulaUsed,
    leanBodyMass: leanBodyMass ? Math.round(leanBodyMass * 10) / 10 : undefined,
  };
}

/**
 * Unit conversion helpers
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

export function kgToLbs(kg: number): number {
  return kg / 0.453592;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Validate user inputs
 */
export function validateInputs(inputs: Partial<UserInputs>): string[] {
  const errors: string[] = [];

  if (!inputs.sex) {
    errors.push('Please select your sex');
  }

  if (!inputs.age || inputs.age < 15 || inputs.age > 100) {
    errors.push('Please enter a valid age between 15 and 100');
  }

  if (!inputs.height || inputs.height < 100 || inputs.height > 250) {
    errors.push('Please enter a valid height');
  }

  if (!inputs.weight || inputs.weight < 30 || inputs.weight > 300) {
    errors.push('Please enter a valid weight');
  }

  if (!inputs.activityLevel) {
    errors.push('Please select your activity level');
  }

  if (inputs.bodyFatPercentage !== undefined) {
    if (inputs.bodyFatPercentage < 3 || inputs.bodyFatPercentage > 60) {
      errors.push('Body fat percentage must be between 3% and 60%');
    }
  }

  return errors;
}
