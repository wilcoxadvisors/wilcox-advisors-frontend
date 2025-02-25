import React from 'react';

function LearnMore() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Learn More About Wilcox Advisors</h1>
        <p className="text-lg text-gray-700 mb-4">
          Wilcox Advisors specializes in providing top-tier financial and accounting services for small businesses. 
          Our expert team offers tailored solutions to help you save money, manage your finances, and grow your business.
        </p>
        <p className="text-lg text-gray-700">
          Explore our services, including bookkeeping, cash flow management, and outsourced CFO support. 
          Contact us today to see how we can help your business thrive!
        </p>
        <button 
          onClick={() => window.location.href = '/#contact'} // Navigates back to contact section
          className="mt-6 bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition duration-200"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}

export default LearnMore;
