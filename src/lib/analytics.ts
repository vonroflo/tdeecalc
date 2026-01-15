// Google Analytics 4 Integration
// Replace GA_MEASUREMENT_ID with your actual GA4 measurement ID

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('event', eventName, params);
};

// Predefined events for the calculator
export const analyticsEvents = {
  // Calculator interactions
  calculateTDEE: (data: {
    sex: string;
    activityLevel: string;
    unitSystem: string;
    hasBodyFat: boolean;
  }) => {
    trackEvent('calculate_tdee', {
      sex: data.sex,
      activity_level: data.activityLevel,
      unit_system: data.unitSystem,
      has_body_fat: data.hasBodyFat,
    });
  },

  // Deficit selection
  selectDeficit: (deficitType: string, calories: number) => {
    trackEvent('select_deficit', {
      deficit_type: deficitType,
      target_calories: calories,
    });
  },

  // Share results
  shareResults: (method: string) => {
    trackEvent('share_results', {
      share_method: method,
    });
  },

  // Recalculate
  recalculate: () => {
    trackEvent('recalculate');
  },

  // Error tracking
  calculationError: (errors: string[]) => {
    trackEvent('calculation_error', {
      errors: errors.join(', '),
    });
  },

  // Education section interactions
  expandFAQ: (question: string) => {
    trackEvent('expand_faq', {
      question: question,
    });
  },

  // User engagement
  timeOnResults: (seconds: number) => {
    trackEvent('time_on_results', {
      duration_seconds: seconds,
    });
  },

  // Unit system toggle
  toggleUnitSystem: (system: string) => {
    trackEvent('toggle_unit_system', {
      system: system,
    });
  },
};
