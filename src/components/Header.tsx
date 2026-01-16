'use client';

import { useState, useCallback } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    // For calculator section, scroll to very top of page
    if (targetId === 'calculator') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 56; // h-14 = 3.5rem = 56px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;
      window.scrollTo({ top: Math.max(0, offsetPosition), behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
          <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            TD
          </span>
          <span className="hidden sm:inline">TDEECalc<span className="text-emerald-600 dark:text-emerald-400">.io</span></span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#calculator"
            onClick={(e) => scrollToSection(e, 'calculator')}
            className="text-sm font-medium text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
          >
            Calculator
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
            className="text-sm font-medium text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
          >
            How It Works
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href="#calculator"
            onClick={(e) => scrollToSection(e, 'calculator')}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Calculate Now
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-2">
            <a
              href="#calculator"
              onClick={(e) => scrollToSection(e, 'calculator')}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 dark:text-gray-400"
            >
              Calculator
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 dark:text-gray-400"
            >
              How It Works
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
