'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserInputs, UnitSystem, Sex, ActivityLevel } from '@/types/calculator';
import { kgToLbs, cmToFeetInches } from '@/lib/calculator';

const PARAM_KEYS = {
  sex: 's',
  age: 'a',
  height: 'h',
  weight: 'w',
  activityLevel: 'al',
  bodyFatPercentage: 'bf',
  unitSystem: 'u',
} as const;

export function encodeToUrlParams(inputs: UserInputs): URLSearchParams {
  const params = new URLSearchParams();
  params.set(PARAM_KEYS.sex, inputs.sex);
  params.set(PARAM_KEYS.age, inputs.age.toString());
  params.set(PARAM_KEYS.height, Math.round(inputs.height).toString());
  params.set(PARAM_KEYS.weight, Math.round(inputs.weight * 10).toString());
  params.set(PARAM_KEYS.activityLevel, inputs.activityLevel);
  params.set(PARAM_KEYS.unitSystem, inputs.unitSystem);
  if (inputs.bodyFatPercentage) {
    params.set(PARAM_KEYS.bodyFatPercentage, inputs.bodyFatPercentage.toString());
  }
  return params;
}

export function decodeFromUrlParams(params: URLSearchParams): Partial<UserInputs> | null {
  const sex = params.get(PARAM_KEYS.sex) as Sex | null;
  const age = params.get(PARAM_KEYS.age);
  const height = params.get(PARAM_KEYS.height);
  const weight = params.get(PARAM_KEYS.weight);
  const activityLevel = params.get(PARAM_KEYS.activityLevel) as ActivityLevel | null;
  const unitSystem = (params.get(PARAM_KEYS.unitSystem) as UnitSystem) || 'imperial';
  const bodyFatPercentage = params.get(PARAM_KEYS.bodyFatPercentage);

  if (!sex || !age || !height || !weight || !activityLevel) {
    return null;
  }

  return {
    sex,
    age: parseInt(age),
    height: parseInt(height),
    weight: parseInt(weight) / 10,
    activityLevel,
    unitSystem,
    bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : undefined,
  };
}

export function generateShareableUrl(inputs: UserInputs): string {
  const params = encodeToUrlParams(inputs);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}?${params.toString()}`;
}

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [initialInputs, setInitialInputs] = useState<Partial<UserInputs> | null>(null);

  useEffect(() => {
    if (searchParams && searchParams.toString()) {
      const decoded = decodeFromUrlParams(searchParams);
      if (decoded) {
        setInitialInputs(decoded);
      }
    }
  }, [searchParams]);

  const updateUrl = useCallback((inputs: UserInputs) => {
    const params = encodeToUrlParams(inputs);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const clearUrl = useCallback(() => {
    router.replace('/', { scroll: false });
    setInitialInputs(null);
  }, [router]);

  return { initialInputs, updateUrl, clearUrl, hasUrlParams: !!initialInputs };
}

export function formatInputsForDisplay(inputs: UserInputs): string {
  const unitSystem = inputs.unitSystem;
  let heightStr: string;
  let weightStr: string;

  if (unitSystem === 'imperial') {
    const { feet, inches } = cmToFeetInches(inputs.height);
    heightStr = `${feet}'${inches}"`;
    weightStr = `${Math.round(kgToLbs(inputs.weight))} lbs`;
  } else {
    heightStr = `${Math.round(inputs.height)} cm`;
    weightStr = `${Math.round(inputs.weight)} kg`;
  }

  const activityLabels: Record<ActivityLevel, string> = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    very_active: 'Very Active',
    extra_active: 'Extra Active',
  };

  return `${inputs.sex === 'male' ? 'M' : 'F'}, ${inputs.age}y, ${heightStr}, ${weightStr}, ${activityLabels[inputs.activityLevel]}`;
}
