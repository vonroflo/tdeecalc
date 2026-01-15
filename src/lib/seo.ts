import { Metadata } from 'next';

export const siteConfig = {
  name: 'TDEECalc.io',
  title: 'TDEE Calculator - Calculate Your Daily Calorie Needs for Weight Loss',
  description:
    'Free TDEE calculator with personalized weight loss targets. Get your daily calorie needs, macro recommendations, and actionable guidance for sustainable fat loss.',
  url: 'https://tdeecalc.io',
  ogImage: 'https://tdeecalc.io/og-image.png',
  twitter: '@tdeecalc',
  keywords: [
    'TDEE calculator',
    'calorie calculator',
    'weight loss calculator',
    'BMR calculator',
    'macro calculator',
    'daily calorie needs',
    'calories to lose weight',
    'maintenance calories',
    'calorie deficit calculator',
    'metabolism calculator',
    'how many calories to lose weight',
    'weight loss calorie calculator',
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'TDEE Calculator - Calculate Your Daily Calorie Needs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

// JSON-LD structured data for the calculator
export function generateCalculatorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TDEE Calculator',
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Calculate Total Daily Energy Expenditure (TDEE)',
      'Personalized weight loss calorie targets',
      'Macro nutrient recommendations',
      'BMR calculation using Mifflin-St Jeor formula',
      'Advanced calculation with body fat percentage',
      'Support for metric and imperial units',
    ],
  };
}

// JSON-LD structured data for FAQ
export function generateFAQSchema() {
  const faqs = [
    {
      question: 'What is TDEE?',
      answer:
        'TDEE stands for Total Daily Energy Expenditure. It is the total number of calories your body burns in a day, including your base metabolism (BMR), physical activity, and the energy used to digest food.',
    },
    {
      question: 'How accurate is this TDEE calculator?',
      answer:
        'The Mifflin-St Jeor equation we use is one of the most validated formulas, accurate within about 10% for most people. If you provide your body fat percentage, we use the Katch-McArdle formula for even better accuracy.',
    },
    {
      question: 'How many calories should I eat to lose weight?',
      answer:
        'For sustainable weight loss, we recommend a 15-25% calorie deficit from your TDEE. This typically results in 0.25-0.7 kg (0.5-1.5 lbs) of fat loss per week while preserving muscle mass.',
    },
    {
      question: 'How often should I recalculate my TDEE?',
      answer:
        'Recalculate your TDEE every 5-10 lbs (2-5 kg) lost, or every 4-6 weeks. As you lose weight, your body requires fewer calories to maintain itself.',
    },
    {
      question: 'Why is protein important during weight loss?',
      answer:
        'Protein helps preserve muscle mass when you are in a calorie deficit, keeps you feeling fuller longer, and has a higher thermic effect. We recommend 1.6-2.2g per kg of body weight when losing weight.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// JSON-LD structured data for the organization
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      // Add social media links here
    ],
  };
}

// Combined JSON-LD for the page
export function generatePageSchema() {
  return [
    generateCalculatorSchema(),
    generateFAQSchema(),
    generateOrganizationSchema(),
  ];
}
