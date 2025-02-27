import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define services list
const servicesList = [
  { id: 'bookkeeping', title: 'Bookkeeping', description: 'Full-service bookkeeping including transaction coding and reconciliations' },
  { id: 'monthlyFinancials', title: 'Monthly Financial Package', description: 'Comprehensive monthly financial statements with analysis' },
  { id: 'cashFlow', title: 'Cash Flow Management', description: 'Detailed cash flow tracking and forecasting' },
  { id: 'customReporting', title: 'Custom Reporting', description: 'Tailored financial reports for your specific needs' },
  { id: 'budgeting', title: 'Budgeting & Forecasting', description: 'Development and monitoring of budgets and forecasts' },
  { id: 'controllerCFO', title: 'Outsourced Controller/CFO Services', description: 'Strategic financial oversight and planning tailored to your business' },
];

// Define multi-step consultation form structure
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

// Define checklist form fields
const checklistFormFields = [
  { name: "name", label: "Your Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "companyName", label: "Company Name", type: "text", required: true },
  { name: "revenueRange", label: "Annual Revenue Range", type: "select", options: ["Under $100K", "$100K - $250K", "$250K - $500K", "$500K - $1M", "Over $1M"], required: true },
];

export default function WilcoxAdvisors() {
  const navigate = useNavigate();

  // State declarations
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
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
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi there! How can I help with your financial needs today?", sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [clientChatOpen, setClientChatOpen] = useState(false);
  const [clientChatMessages, setClientChatMessages] = useState([]);
  const [clientChatInput, setClientChatInput] = useState('');
  const [dashboardData, setDashboardData] = useState({
    financials: { 
      profitLoss: { revenue: 50000, expenses: 30000, netIncome: 20000 }, 
      balanceSheet: { assets: 100000, liabilities: 40000, equity: 60000 } 
    },
    cashFlow: { labels: ['Jan', 'Feb', 'Mar'], data: [10000, 15000, 12000] },
    reports: ['Sales by Category', 'Expense Breakdown'],
    gl: [{ date: '2025-02-01', description: 'Sales', amount: 5000 }],
    blogDrafts: [],
    hero: { 
      headline: "Financial Expertise for Your Business Success", 
      subtext: "Professional accounting and financial services tailored for small businesses. We handle the numbers so you can focus on growth." 
    },
    about: "At Wilcox Advisors, we specialize in financial solutions for small businesses. From startups to growing companies, we provide the expertise you need to succeed—built to scale with you every step of the way.",
  });
  const [blogPosts, setBlogPosts] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const chatRef = useRef(null);

  // Effect to handle authentication and initial data fetching
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchBlogPosts();
      fetchDashboardData();
    }
  }, []);

  // Effect to scroll chat to the bottom when messages update
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages, clientChatMessages]);

  // Fetch dashboard data based on user role
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token'); // Use localStorage to get the token
    try {
      const response = await axios.get(
        isAdmin 
          ? `${process.env.REACT_APP_API_URL}/api/admin/dashboard` 
          : `${process.env.REACT_APP_API_URL}/api/client/dashboard`
      , {
        headers: token ? { Authorization: `Bearer ${token}` } : {} // Send token if exists, otherwise empty
      });
      setDashboardData(prev => ({ ...prev, ...response.data }));
      if (!isAdmin && response.data.clientChat) {
        setClientChatMessages(response.data.clientChat);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error.response ? error.response.data : error.message);
    }
  };

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  // Validation functions
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

  // Form handlers
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

  // Chat handlers
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = { text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    const token = localStorage.getItem('token'); // Optionally check for token
    try {
      console.log('Chat request details:', {
        url: `${process.env.REACT_APP_API_URL}/api/chat`,
        token: token ? 'Present' : 'Missing',
        message: chatInput
      });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, { message: chatInput }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {} // Send token if exists
      });
      setChatMessages(prev => [...prev, { text: response.data.reply, sender: 'ai' }]);
    } catch (error) {
      console.error('Chat request failed:', error.response ? error.response.data : error.message);
      setChatMessages(prev => [...prev, { text: 'Sorry, something went wrong.', sender: 'ai' }]);
    }
  };

  const handleClientChatSubmit = async (e) => {
    e.preventDefault();
    if (!clientChatInput.trim()) return;
    const userMessage = { text: clientChatInput, sender: 'user' };
    setClientChatMessages(prev => [...prev, userMessage]);
    setClientChatInput('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/client/chat`, { message: clientChatInput });
      setClientChatMessages(prev => [...prev, { text: response.data.reply, sender: 'ai' }]);
    } catch (error) {
      setClientChatMessages(prev => [...prev, { text: 'For detailed advice, schedule a consultation!', sender: 'ai' }]);
    }
  };

  // Authentication handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) 
      return alert('Please enter both email and password.');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, loginData);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setIsAdmin(response.data.isAdmin);
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  // File and content management handlers
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, uploadFormData);
      alert('File uploaded successfully!');
      fetchDashboardData();
    } catch (error) {
      alert('Upload failed. Please try again.');
    }
  };

  const handleBlogEdit = (draft) => setEditingBlog({ ...draft });

  const handleBlogSave = async () => {
    try {
      if (editingBlog._id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/${editingBlog._id}`, editingBlog);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/blog`, editingBlog);
      }
      setEditingBlog(null);
      fetchBlogPosts();
      fetchDashboardData();
      alert('Blog post saved!');
    } catch (error) {
      alert('Failed to save blog post.');
    }
  };

  const handleContentEdit = (section) => setEditingContent({ section, value: dashboardData[section] });

  const handleContentSave = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/content`, editingContent);
      setDashboardData(prev => ({ ...prev, [editingContent.section]: editingContent.value }));
      setEditingContent(null);
      alert('Content saved!');
    } catch (error) {
      alert('Failed to save content.');
    }
  };

  // Chart data for cash flow
  const cashFlowChartData = {
    labels: dashboardData.cashFlow.labels,
    datasets: [{
      label: 'Cash Flow',
      data: dashboardData.cashFlow.data,
      borderColor: '#1E3A8A',
      tension: 0.1,
    }],
  };

  // JSX Render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl text-blue-800 font-bold">WILCOX ADVISORS</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-800">Services</a>
              <a href="#blog" className="text-gray-700 hover:text-blue-800">Blog</a>
              <a href="#about" className="text-gray-700 hover:text-blue-800">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-800">Contact</a>
              {isLoggedIn ? (
                <>
                  <a href="#dashboard" className="text-gray-700 hover:text-blue-800">Dashboard</a>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-blue-800">Logout</button>
                </>
              ) : (
                <button onClick={() => setShowLogin(true)} className="text-gray-700 hover:text-blue-800">Login</button>
              )}
              <button onClick={() => setShowConsultationForm(true)} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">
                Free Consultation
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-blue-800">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-800" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
                <a href="#blog" className="block px-3 py-2 text-gray-700 hover:text-blue-800" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-800" onClick={() => setIsMobileMenuOpen(false)}>About</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-800" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                {isLoggedIn ? (
                  <>
                    <a href="#dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-800" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800">Logout</button>
                  </>
                ) : (
                  <button onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800">
                    Login
                  </button>
                )}
                <button onClick={() => { setShowConsultationForm(true); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800">
                  Free Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Lead Magnet Section */}
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

      {/* Services Section */}
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

      {/* Blog Section */}
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

      {/* Admin Dashboard Section */}
      {isLoggedIn && isAdmin && (
        <section id="dashboard" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Admin Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Blog Drafts</h3>
                {editingBlog ? (
                  <div>
                    <input
                      type="text"
                      value={editingBlog.title}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                      placeholder="Blog Title"
                    />
                    <ReactQuill value={editingBlog.content} onChange={(content) => setEditingBlog({ ...editingBlog, content })} className="mb-4" />
                    <div className="flex space-x-4">
                      <button onClick={handleBlogSave} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">Save</button>
                      <button onClick={() => setEditingBlog(null)} className="text-gray-700 hover:text-blue-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.blogDrafts.map((draft, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900">{draft.title}</h4>
                        <div dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) + '...' }} />
                        <button onClick={() => handleBlogEdit(draft)} className="text-blue-800 hover:underline mt-2">Edit</button>
                      </div>
                    ))}
                    <button onClick={() => setEditingBlog({ title: '', content: '' })} className="text-blue-800 hover:underline mt-4">Add New Draft</button>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Site Content</h3>
                {editingContent ? (
                  <div>
                    <h4 className="font-semibold mb-2">{editingContent.section === 'hero' ? 'Hero Section' : 'About Section'}</h4>
                    {editingContent.section === 'hero' ? (
                      <>
                        <input
                          type="text"
                          value={editingContent.value.headline}
                          onChange={(e) => setEditingContent({ ...editingContent, value: { ...editingContent.value, headline: e.target.value } })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                        />
                        <textarea
                          value={editingContent.value.subtext}
                          onChange={(e) => setEditingContent({ ...editingContent, value: { ...editingContent.value, subtext: e.target.value } })}
                          rows={3}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                        />
                      </>
                    ) : (
                      <textarea
                        value={editingContent.value}
                        onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                      />
                    )}
                    <div className="flex space-x-4">
                      <button onClick={handleContentSave} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">Save</button>
                      <button onClick={() => setEditingContent(null)} className="text-gray-700 hover:text-blue-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Hero Section</h4>
                      <p className="text-gray-700">{dashboardData.hero.headline}</p>
                      <p className="text-gray-700">{dashboardData.hero.subtext}</p>
                      <button onClick={() => handleContentEdit('hero')} className="text-blue-800 hover:underline mt-2">Edit</button>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">About Section</h4>
                      <p className="text-gray-700">{dashboardData.about}</p>
                      <button onClick={() => handleContentEdit('about')} className="text-blue-800 hover:underline mt-2">Edit</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Client Dashboard Section */}
      {isLoggedIn && !isAdmin && (
        <section id="dashboard" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Your Financial Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700"><strong>Profit & Loss (YTD):</strong> ${dashboardData.financials.profitLoss.revenue} Revenue, ${dashboardData.financials.profitLoss.expenses} Expenses</p>
                    <p className="text-gray-700"><strong>Net Income:</strong> ${dashboardData.financials.profitLoss.netIncome}</p>
                  </div>
                  <div>
                    <p className="text-gray-700"><strong>Balance Sheet:</strong> ${dashboardData.financials.balanceSheet.assets} Assets, ${dashboardData.financials.balanceSheet.liabilities} Liabilities</p>
                    <p className="text-gray-700"><strong>Equity:</strong> ${dashboardData.financials.balanceSheet.equity}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cash Flow</h3>
                <Line data={cashFlowChartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Reports</h3>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  {dashboardData.reports.map((report, index) => (
                    <option key={index} value={report}>{report}</option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">General Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.gl.map((entry, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{entry.date}</td>
                          <td className="px-4 py-2">{entry.description}</td>
                          <td className="px-4 py-2">${entry.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Data</h3>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Download Deliverables</h3>
                <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition duration-200">
                  Download Latest Report
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Chat with Us</h3>
                <button onClick={() => setClientChatOpen(!clientChatOpen)} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200">
                  {clientChatOpen ? 'Close Chat' : 'Open Chat'}
                </button>
                {clientChatOpen && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div ref={chatRef} className="h-64 overflow-y-auto space-y-3 mb-4">
                      {clientChatMessages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleClientChatSubmit} className="flex space-x-2">
                      <input
                        type="text"
                        value={clientChatInput}
                        onChange={(e) => setClientChatInput(e.target.value)}
                        className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ask a question..."
                      />
                      <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-900 transition duration-200">
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
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

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-8">About Wilcox Advisors</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">{dashboardData.about}</p>
        </div>
      </section>

      {/* Contact Us Section */}
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

      {/* Consultation Form Modal */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg md:max-w-3xl">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-800">Schedule Your Free Consultation</h2>
              <button onClick={() => { setShowConsultationForm(false); setCurrentStep(0); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-8">
                {formSteps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentStep ? 'bg-blue-800 text-white' :
                      index < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    {index < formSteps.length - 1 && (
                      <div className={`h-1 w-12 sm:w-16 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={handleConsultationSubmit}>
                {currentStep === 1 ? (
                  <div className="space-y-4">
                    {servicesList.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200"
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <div className="flex items-center h-5">
                          <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                            formData.services.includes(service.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                            {formData.services.includes(service.id) && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <label className="text-sm font-medium text-gray-900 cursor-pointer">{service.title}</label>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formSteps[currentStep].fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          >
                            <option value="">Select an option</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex justify-between">
                  {currentStep > 0 && (
                    <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center px-4 py-2 text-blue-800 hover:text-blue-900 transition duration-200">
                      <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                    </button>
                  )}
                  <button
                    type={currentStep === formSteps.length - 1 ? 'submit' : 'button'}
                    onClick={currentStep < formSteps.length - 1 ? () => setCurrentStep(currentStep + 1) : undefined}
                    disabled={!isStepValid()}
                    className={`ml-auto px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                      isStepValid() ? 'bg-blue-800 text-white hover:bg-blue-900' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentStep === formSteps.length - 1 ? 'Submit' : 'Next'}
                    {currentStep < formSteps.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Form Modal */}
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

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Client Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button type="submit" className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition duration-200">
                  Login
                </button>
                <button type="button" onClick={() => setShowLogin(false)} className="text-gray-700 hover:text-blue-800">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">© 2025 Wilcox Advisors. All rights reserved.</p>
          <a href="#contact" className="text-blue-300 hover:text-blue-100 text-sm sm:text-base font-medium">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
