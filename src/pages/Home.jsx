// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import section components
import HeroSection from '../components/sections/HeroSection';
import ChecklistSection from '../components/sections/ChecklistSection';
import ServicesSection from '../components/sections/ServicesSection';
import BlogSection from '../components/sections/BlogSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

// Import modal components
import ChecklistModal from '../components/modals/ChecklistModal';

// Import common components
import ChatWidget from '../components/common/ChatWidget';

// Service list data
const servicesList = [
  { id: 'bookkeeping', title: 'Bookkeeping', description: 'Full-service bookkeeping including transaction coding and reconciliations' },
  { id: 'monthlyFinancials', title: 'Monthly Financial Package', description: 'Comprehensive monthly financial statements with analysis' },
  { id: 'cashFlow', title: 'Cash Flow Management', description: 'Detailed cash flow tracking and forecasting' },
  { id: 'customReporting', title: 'Custom Reporting', description: 'Tailored financial reports for your specific needs' },
  { id: 'budgeting', title: 'Budgeting & Forecasting', description: 'Development and monitoring of budgets and forecasts' },
  { id: 'controllerCFO', title: 'Outsourced Controller/CFO Services', description: 'Strategic financial oversight and planning tailored to your business' },
];

function Home() {
  // State management
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  
  // Dashboard data (would ideally come from API or context)
  const dashboardData = {
    hero: { 
      headline: "Financial Expertise for Your Business Success", 
      subtext: "Professional accounting and financial services tailored for small businesses. We handle the numbers so you can focus on growth." 
    },
    about: "At Wilcox Advisors, we specialize in financial solutions for small businesses. From startups to growing companies, we provide the expertise you need to succeed—built to scale with you every step of the way.",
  };

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:10000'}/api/blog`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection dashboardData={dashboardData} />
      <ChecklistSection setShowChecklistForm={setShowChecklistForm} />
      <ServicesSection servicesList={servicesList} />
      <BlogSection blogPosts={blogPosts} />
      <TestimonialsSection />
      <AboutSection aboutText={dashboardData.about} />
      <ContactSection />

      {showChecklistForm && (
        <ChecklistModal 
          isOpen={showChecklistForm}
          onClose={() => setShowChecklistForm(false)}
        />
      )}

      <ChatWidget 
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />
    </div>
  );
}

export default Home;
