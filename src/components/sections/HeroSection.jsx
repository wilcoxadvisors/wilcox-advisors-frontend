// src/components/sections/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection({ dashboardData, setShowConsultationForm }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{dashboardData.hero.headline}</h1>
          <p className="text-xl mb-8">{dashboardData.hero.subtext}</p>
          <div className="space-x-4">
            <button 
              onClick={() => setShowConsultationForm(true)} 
              className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Schedule Free Consultation
            </button>
            <button 
              onClick={() => navigate('/learn-more')} 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
