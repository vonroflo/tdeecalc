'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is TDEE?',
    answer:
      'TDEE stands for Total Daily Energy Expenditure. It\'s the total number of calories your body burns in a day, including your base metabolism (BMR), physical activity, and the energy used to digest food (TEF). Knowing your TDEE helps you understand how many calories you need to maintain, lose, or gain weight.',
  },
  {
    question: 'How does a calorie deficit lead to weight loss?',
    answer:
      'When you eat fewer calories than your TDEE, your body must get the extra energy from somewhere — typically stored body fat. A deficit of about 500 calories per day leads to roughly 0.45 kg (1 lb) of fat loss per week. The key is finding a deficit that\'s sustainable without being so aggressive that you lose muscle or feel constantly hungry.',
  },
  {
    question: 'Why is protein so important during weight loss?',
    answer:
      'Protein helps preserve muscle mass when you\'re in a calorie deficit. Without enough protein, your body may break down muscle for energy along with fat. Protein also keeps you feeling fuller longer and has a higher thermic effect (burns more calories during digestion). We recommend 1.6-2.2g per kg of body weight when losing weight.',
  },
  {
    question: 'Why shouldn\'t I just eat as little as possible?',
    answer:
      'Extreme calorie restriction can backfire. Very low calorie diets lead to muscle loss, metabolic adaptation (your body burns fewer calories), nutrient deficiencies, hormonal disruption, and are nearly impossible to maintain. A moderate 15-25% deficit is far more effective for long-term fat loss.',
  },
  {
    question: 'How accurate is this calculator?',
    answer:
      'The Mifflin-St Jeor equation we use is one of the most validated formulas, accurate within about 10% for most people. If you provide your body fat percentage, we use the Katch-McArdle formula for even better accuracy. However, all calculators are estimates — use your results as a starting point and adjust based on real-world progress.',
  },
  {
    question: 'What if my weight isn\'t changing?',
    answer:
      'If your weight hasn\'t changed after 2-3 weeks of consistent tracking, reduce your target by 100-200 calories. Remember that weight can fluctuate daily due to water retention, so focus on weekly averages. If you\'re exercising more, you might also be gaining muscle while losing fat — take measurements and progress photos alongside the scale.',
  },
  {
    question: 'Should I eat back exercise calories?',
    answer:
      'Generally, no. Your activity level selection already accounts for your typical exercise. Calorie burn estimates from fitness trackers are often inflated by 20-50%. If you do an unusually intense workout and feel very hungry, eating a small portion back (25-50%) is reasonable, but avoid eating back all "burned" calories.',
  },
  {
    question: 'How often should I recalculate my TDEE?',
    answer:
      'Recalculate every 5-10 lbs (2-5 kg) lost, or every 4-6 weeks. As you lose weight, your body requires fewer calories to maintain itself. Keeping your targets updated ensures continued progress and prevents plateaus.',
  },
];

export default function EducationSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="mt-4" aria-labelledby="education-heading">
      <div className="text-center mb-8">
        <h2
          id="education-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Understanding Your Results
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Knowledge is power. Here&apos;s what you need to know to use your TDEE effectively for sustainable weight loss.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-expanded={openItems.has(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  openItems.has(index) ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-200 ${
                openItems.has(index) ? 'max-h-96' : 'max-h-0'
              }`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
            >
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Tips Section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-emerald-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Tips for Success
          </h3>
          <ul className="space-y-3">
            {[
              'Track your food for at least 2 weeks to understand your actual intake',
              'Weigh yourself at the same time daily, but focus on weekly averages',
              'Prioritize protein at every meal to stay full and preserve muscle',
              'Don\'t panic if weight fluctuates — it\'s normal and expected',
              'Sleep 7-9 hours per night; poor sleep increases hunger hormones',
              'Stay hydrated — thirst is often mistaken for hunger',
            ].map((tip, index) => (
              <li key={index} className="flex gap-3">
                <svg
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only.
          It is not medical advice. Consult a healthcare provider or registered dietitian before starting
          any weight loss program, especially if you have health conditions or are taking medications.
        </p>
      </div>
    </section>
  );
}
