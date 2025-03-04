import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8" role="contentinfo" aria-label="Footer">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm sm:text-base">© 2025 Wilcox Advisors. All rights reserved.</p>
        <a 
          href="#contact" 
          className="text-blue-300 hover:text-blue-100 text-sm sm:text-base font-medium" 
          aria-label="Contact us"
          data-tooltip="Contact Wilcox Advisors for support on manual data entry"
        >
          Contact Us
        </a>
        <p className="text-xs mt-2 text-gray-400" aria-live="polite">
          This system is designed for scalability and will soon support cloud hosting for larger datasets.
        </p>
        <a 
          href="/help" 
          className="text-blue-300 hover:text-blue-100 text-sm sm:text-base font-medium mt-2 block" 
          aria-label="Help center"
          data-tooltip="Access help and tutorials for manual entries and budgets"
        >
          Help Center
        </a>
      </div>
    </footer>
  );
}

export default Footer;
