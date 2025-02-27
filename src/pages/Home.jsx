import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';

const servicesList = [
  { id: 'bookkeeping', title: 'Bookkeeping', description: 'Full-service bookkeeping including transaction coding and reconciliations' },
  { id: 'monthlyFinancials', title: 'Monthly Financial Package', description: 'Comprehensive monthly financial statements with analysis' },
  { id: 'cashFlow', title: 'Cash Flow Management', description: 'Detailed cash flow tracking and forecasting' },
  { id: 'customReporting', title: 'Custom Reporting', description: 'Tailored financial reports for your specific needs' },
  { id: 'budgeting', title: 'Budgeting & Forecasting', description: 'Development and monitoring of budgets and forecasts' },
  { id: 'controllerCFO', title: 'Outsourced Controller/CFO Services', description: 'Strategic financial oversight and planning tailored to your business' },
];

const formSteps = [
  {
    title: "Company Information",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "industry", label: "Industry", type: "text", required: true },
      { name: "yearsInBusiness", label: "Years in Business", type: "select", options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"], required: true },
      { name: "revenueRange", label: "Annual Revenue Range", type: "select", options: ["Under $100K", "$100K - $250K", "$250K - $500K", "$500K - $1M", "Over $1M"], required: true },
    ],
  },
  { title: "Services of Interest", fields: [{ name: "services", type: "services", required: true }] },
  {
    title: "Contact Information",
    fields: [
      { name: "contactName", label: "Your Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: false },
      { name: "preferredContact", label: "Preferred Contact Method", type: "select", options: ["Email", "Phone"], required: true },
      { name: "preferredTime", label: "Best Time to Contact", type: "select", options: ["Morning", "Afternoon", "Evening"], required: true },
      { name: "notes", label: "Additional Notes", type: "textarea", required: false },
    ],
  },
];

const checklistFormFields = [
  { name: "name", label: "Your Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "companyName", label: "Company Name", type: "text", required: true },
  { name: "revenueRange", label: "Annual Revenue Range", type: "select", options: ["Under $100K", "$100K - $250K", "$250K - $500K", "$500K - $1M", "Over $1M"], required: true },
];

function Home({ setShowConsultationForm }) {
  const navigate = useNavigate();
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '', industry: '', yearsInBusiness: '', revenueRange: '', services: [],
    contactName: '', email: '', phone: '', preferredContact: '', preferredTime: '', notes: '',
  });
  const [checklistData, setChecklistData] = useState({
    name: '', email: '', companyName: '', revenueRange: '',
  });
  const [contactData, setContactData] = useState({
    name: '', email: '', company: '', message: '',
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi there! How can I help with your financial needs today?", sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const chatRef = useRef(null);

  const dashboardData = {
    hero: { 
      headline: "Financial Expertise for Your Business Success", 
      subtext: "Professional accounting and financial services tailored for small businesses. We handle the numbers so you can focus on growth." 
    },
    about: "At Wilcox Advisors, we specialize in financial solutions for small businesses. From startups to growing companies, we provide the expertise you need to succeed—built to scale with you every step of the way.",
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  const isStepValid = () => {
    const fields = formSteps[currentStep].fields;
    return fields.every(field => 
      field.required 
        ? (field.type === 'services' ? formData.services.length > 0 : formData[field.name]?.trim() !== '') 
        : true
    );
  };

  const isChecklistValid = () => 
    checklistFormFields.every(field => field.required ? checklistData[field.name]?.trim() !== '' : true);

  const isContactValid = () => 
    Object.values(contactData).every(value => value.trim() !== '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId) 
        ? prev.services.filter(id => id !== serviceId) 
        : [...prev.services, serviceId],
    }));
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < formSteps.length - 1) {
      if (isStepValid()) setCurrentStep(currentStep + 1);
    } else {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/consultation`, formData);
        alert('Thank you! Your request has been submitted. We’ll contact you shortly!');
        setShowConsultationForm(false);
        setCurrentStep(0);
        setFormData({ 
          companyName: '', industry: '', yearsInBusiness: '', revenueRange: '', services: [], 
          contactName: '', email: '', phone: '', preferredContact: '', preferredTime: '', notes: '' 
        });
      } catch (error) {
        alert('Submission failed. Please try again.');
      }
    }
  };

  const handleChecklistInputChange = (e) => {
    const { name, value } = e.target;
    setChecklistData(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistSubmit = async (e) => {
    e.preventDefault();
    if (!isChecklistValid()) return alert('Please fill out all required fields.');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/checklist`, checklistData);
      alert('Thank you! Check your email for the Financial Checklist!');
      setShowChecklistForm(false);
      setChecklistData({ name: '', email: '', companyName: '', revenueRange: '' });
    } catch (error) {
      alert('Submission failed. Please try again.');
    }
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!isContactValid()) return alert('Please fill out all required fields.');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/contact`, contactData);
      alert('Thank you for your message! We will get back to you soon.');
      setContactData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      alert('Submission failed. Please try again.');
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = { text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, { message: chatInput }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setChatMessages(prev => [...prev, { text: response.data.reply, sender: 'ai' }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { text: 'Sorry, something went wrong.', sender: 'ai' }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{dashboardData.hero.headline}</h1>
            <p className="text-xl mb-8">{dashboardData.hero.subtext}</p>
            <div className="space-x-4">
              <button onClick={() => setShowConsultationForm(true)} className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
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

      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Free Financial Checklist</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Download our checklist to streamline your small business finances—simple steps to save time and money!
          </p>
          <button onClick={() => setShowChecklistForm(true)} className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition duration-200">
            Get It Now
          </button>
        </div>
      </section>

      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Our Small Business Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Blog & Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <div key={post._id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
                <p className="mt-4 text-blue-800 font-medium">
                  <a href="#contact">Contact us to learn more!</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">What Small Businesses Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 italic">"Wilcox Advisors made our finances manageable—perfect for my small shop!"</p>
              <p className="mt-4 text-gray-900 font-medium">— Local Retail Owner</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 italic">"Their cash flow help kept my startup alive. Amazing support!"</p>
              <p className="mt-4 text-gray-900 font-medium">— Tech Founder</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-8">About Wilcox Advisors</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">{dashboardData.about}</p>
        </div>
      </section>

      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Contact Us</h2>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <p className="text-gray-700 mb-6 text-center">
              Have questions about our services? Send us a message and we'll get back to you as soon as possible.
            </p>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Your Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={contactData.name}
                  onChange={handleContactInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleContactInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="company"
                  value={contactData.company}
                  onChange={handleContactInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Message <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  value={contactData.message}
                  onChange={handleContactInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-900 transition duration-200"
                disabled={!isContactValid()}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {showChecklistForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md sm:max-w-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Get Your Free Financial Checklist</h2>
            <p className="text-gray-700 mb-6">Please provide your details to download the checklist!</p>
            <form onSubmit={handleChecklistSubmit} className="space-y-6">
              {checklistFormFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={checklistData[field.name]}
                      onChange={handleChecklistInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={field.required}
                    >
                      <option value="">Select an option</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={checklistData[field.name]}
                      onChange={handleChecklistInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setShowChecklistForm(false)} className="text-gray-700 hover:text-blue-800">Cancel</button>
                <button 
                  type="submit" 
                  className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 transition duration-200" 
                  disabled={!isChecklistValid()}
                >
                  Submit & Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-40">
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-blue-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-900 transition duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8m-4-4v8m9 4a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-blue-800">Chat with Us</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div ref={chatRef} className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="border-t p-4 flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask us anything..."
              />
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-900 transition duration-200">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
