import React from 'react';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon from lucide-react for the back button
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

function LearnMore() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-800">Learn More About Wilcox Advisors</h1>
          <button
            onClick={() => navigate('/')} // Navigate back to the homepage
            className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-900 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Wilcox Advisors specializes in providing top-tier financial and accounting services tailored for small businesses. 
            Our expert team is dedicated to helping you save money, manage your finances effectively, and drive business growth.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Explore our comprehensive services, including bookkeeping, cash flow management, custom reporting, budgeting & forecasting, 
            monthly financial packages, and outsourced controller/CFO support. Whether you’re a startup or a growing company, 
            we offer solutions designed to scale with your business needs. Contact us today to discover how we can help your business thrive!
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/#contact')} // Navigate to the contact section on the homepage
              className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition duration-200"
            >
              Contact Us
            </button>
          </div>
        </section>
      </main>

      {/* Footer (Optional, for consistency with your App.jsx) */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">© 2025 Wilcox Advisors. All rights reserved.</p>
          <a href="/#contact" className="text-blue-300 hover:text-blue-100 text-sm sm:text-base font-medium">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default LearnMore;
