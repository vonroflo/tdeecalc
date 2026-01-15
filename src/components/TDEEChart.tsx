'use client';

import { TDEEBreakdown } from '@/types/calculator';

interface TDEEChartProps {
  breakdown: TDEEBreakdown;
}

export default function TDEEChart({ breakdown }: TDEEChartProps) {
  const total = breakdown.total;

  // Calculate percentages
  const bmrPercent = (breakdown.bmr / total) * 100;
  const neatPercent = (breakdown.neat / total) * 100;
  const tefPercent = (breakdown.tef / total) * 100;

  // SVG dimensions
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash arrays for each segment
  const bmrDash = (bmrPercent / 100) * circumference;
  const neatDash = (neatPercent / 100) * circumference;
  const tefDash = (tefPercent / 100) * circumference;

  // Offsets for positioning each segment
  const bmrOffset = 0;
  const neatOffset = circumference - bmrDash;
  const tefOffset = circumference - bmrDash - neatDash;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100 dark:text-gray-700"
          />

          {/* BMR segment (Blue) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${bmrDash} ${circumference}`}
            strokeDashoffset={bmrOffset}
            className="text-blue-500 dark:text-blue-400"
            strokeLinecap="butt"
          />

          {/* Activity/NEAT segment (Emerald) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${neatDash} ${circumference}`}
            strokeDashoffset={neatOffset}
            className="text-emerald-500 dark:text-emerald-400"
            strokeLinecap="butt"
          />

          {/* TEF segment (Amber) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${tefDash} ${circumference}`}
            strokeDashoffset={tefOffset}
            className="text-amber-500 dark:text-amber-400"
            strokeLinecap="butt"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {total.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">cal/day</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <LegendItem
          color="blue"
          label="BMR (Resting)"
          value={breakdown.bmr}
          percentage={bmrPercent}
        />
        <LegendItem
          color="emerald"
          label="Activity"
          value={breakdown.neat}
          percentage={neatPercent}
        />
        <LegendItem
          color="amber"
          label="Digestion"
          value={breakdown.tef}
          percentage={tefPercent}
        />
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: 'blue' | 'emerald' | 'amber';
  label: string;
  value: number;
  percentage: number;
}

function LegendItem({ color, label, value, percentage }: LegendItemProps) {
  const dotColors = {
    blue: 'bg-blue-500 dark:bg-blue-400',
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${dotColors[color]}`} />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {label}: {Math.round(percentage)}%
      </span>
    </div>
  );
}
