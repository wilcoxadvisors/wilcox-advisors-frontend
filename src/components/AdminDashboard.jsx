import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Home, Users, FileText, Database, FileSpreadsheet, Settings, Globe, 
  Upload, Image, Layout, Edit, Info, Bookmark, Phone, Save, CheckCircle, 
  LogOut, PlusCircle 
} from 'lucide-react';

function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    blogDrafts: [],
    hero: { headline: '', subtext: '' },
    about: '',
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleBlogEdit = (draft) => setEditingBlog({ ...draft });

  const handleBlogSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editingBlog._id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/${editingBlog._id}`, editingBlog, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/blog`, editingBlog, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEditingBlog(null);
      fetchDashboardData();
      alert('Blog post saved!');
    } catch (error) {
      alert('Failed to save blog post.');
    }
  };

  const handleContentEdit = (section) => setEditingContent({ section, value: dashboardData[section] });

  const handleContentSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/content`, editingContent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(prev => ({ ...prev, [editingContent.section]: editingContent.value }));
      setEditingContent(null);
      alert('Content saved!');
    } catch (error) {
      alert('Failed to save content.');
    }
  };
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  const handleWebsiteSave = () => {
    setSaved(true);
    // In a real implementation, save data to backend here
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white h-screen flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold">Wilcox Advisors</h1>
        </div>
        
        <nav className="p-4 flex-grow">
          <NavItem 
            icon={<Home className="mr-3" />} 
            label="Dashboard" 
            active={activeModule === 'dashboard'}
            onClick={() => setActiveModule('dashboard')}
          />
          <NavItem 
            icon={<FileText className="mr-3" />} 
            label="Blogs" 
            active={activeModule === 'blogs'}
            onClick={() => setActiveModule('blogs')}
          />
          <NavItem 
            icon={<Globe className="mr-3" />} 
            label="Website" 
            active={activeModule === 'website'}
            onClick={() => setActiveModule('website')}
          />
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-blue-800">
          <button className="flex items-center w-full p-3 rounded hover:bg-blue-800 text-white">
            <LogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeModule === 'dashboard' && (
          <section className="py-16 px-6">
            <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Admin Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveModule('blogs')}
                    className="bg-blue-100 text-blue-800 p-4 rounded-lg hover:bg-blue-200"
                  >
                    Manage Blog Posts
                  </button>
                  <button 
                    onClick={() => setActiveModule('website')}
                    className="bg-blue-100 text-blue-800 p-4 rounded-lg hover:bg-blue-200"
                  >
                    Edit Website Content
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {activeModule === 'blogs' && (
          <section className="py-16 px-6">
            <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Blog Management</h2>
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
            </div>
          </section>
        )}
        
        {activeModule === 'website' && (
          <div className="p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Website Content Management</h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleWebsiteSave}
                  className="flex items-center bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
                >
                  <Save className="mr-2" size={18} />
                  Save Changes
                </button>
              </div>
            </div>
            
            {saved && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
                <CheckCircle className="mr-2" />
                Changes saved successfully! Your website has been updated.
              </div>
            )}
            
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="flex border-b overflow-x-auto">
                <TabButton 
                  active={activeTab === 'general'} 
                  onClick={() => setActiveTab('general')}
                  icon={<Layout size={16} />}
                  label="General"
                />
                <TabButton 
                  active={activeTab === 'home'} 
                  onClick={() => setActiveTab('home')}
                  icon={<Home size={16} />}
                  label="Home Page"
                />
                <TabButton 
                  active={activeTab === 'learn-more'} 
                  onClick={() => setActiveTab('learn-more')}
                  icon={<Info size={16} />}
                  label="Learn More"
                />
                <TabButton 
                  active={activeTab === 'about'} 
                  onClick={() => setActiveTab('about')}
                  icon={<Bookmark size={16} />}
                  label="About Us"
                />
                <TabButton 
                  active={activeTab === 'services'} 
                  onClick={() => setActiveTab('services')}
                  icon={<FileText size={16} />}
                  label="Services"
                />
                <TabButton 
                  active={activeTab === 'contact'} 
                  onClick={() => setActiveTab('contact')}
                  icon={<Phone size={16} />}
                  label="Contact"
                />
              </div>
              
              <div className="p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">General Settings</h3>
                    
                    {/* Logo Upload */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Website Logo</h4>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded border overflow-hidden">
                          {logoFile ? (
                            <img src={logoFile} alt="New logo preview" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <div className="text-center text-gray-500">
                              <Image size={32} className="mx-auto mb-1" />
                              <p className="text-xs">Current Logo</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="mb-2">
                            <label className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 cursor-pointer">
                              <Upload size={16} className="inline mr-2" />
                              Select New Logo
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleLogoChange}
                              />
                            </label>
                          </div>
                          <p className="text-sm text-gray-500">Recommended size: 180x60 pixels, PNG or SVG format</p>
                        </div>
                      </div>
                    </div>

                    {/* Site Title & Meta */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Website Title & Meta Tags</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Wilcox Advisors - Financial Solutions for Small Businesses"
                          className="w-full p-2 border rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Appears in browser tabs and search results</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description
                        </label>
                        <textarea
                          defaultValue="Wilcox Advisors provides professional financial and accounting services tailored for small businesses, helping you save money and drive business growth."
                          className="w-full p-2 border rounded"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">Appears in search engine results</p>
                      </div>
                    </div>
                    
                    {/* Colors Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Brand Colors</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              defaultValue="#1E3A8A"
                              className="h-10 w-10 p-0 border-0"
                            />
                            <input
                              type="text"
                              defaultValue="#1E3A8A"
                              className="ml-2 p-2 border rounded w-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Secondary Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              defaultValue="#0EA5E9"
                              className="h-10 w-10 p-0 border-0"
                            />
                            <input
                              type="text"
                              defaultValue="#0EA5E9"
                              className="ml-2 p-2 border rounded w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Home Page Tab */}
                {activeTab === 'home' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Home Page Content</h3>
                    
                    {/* Hero Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Hero Section</h4>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Headline
                        </label>
                        <input
                          type="text"
                          defaultValue={dashboardData.hero.headline}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subheading
                        </label>
                        <textarea
                          defaultValue={dashboardData.hero.subtext}
                          className="w-full p-2 border rounded"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    {/* Hero Image */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Hero Background Image</h4>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-24 bg-gray-200 rounded border overflow-hidden">
                          <div className="text-center pt-4 text-gray-500">
                            <Image size={24} className="mx-auto mb-1" />
                            <p className="text-xs">Current Image</p>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2">
                            <label className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 cursor-pointer">
                              <Upload size={16} className="inline mr-2" />
                              Select New Image
                              <input type="file" className="hidden" accept="image/*" />
                            </label>
                          </div>
                          <p className="text-sm text-gray-500">Recommended size: 1920x600 pixels</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Learn More Tab */}
                {activeTab === 'learn-more' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Learn More Page Content</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Page Title</h4>
                      <input
                        type="text"
                        defaultValue="Learn More About Our Services"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Main Content</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Paragraph 1
                        </label>
                        <textarea
                          defaultValue="Wilcox Advisors specializes in providing top-tier financial and accounting services tailored for small businesses. Our expert team is dedicated to helping you save money, manage your finances effectively, and drive business growth."
                          className="w-full p-2 border rounded"
                          rows={4}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Paragraph 2
                        </label>
                        <textarea
                          defaultValue="Explore our comprehensive services, including bookkeeping, cash flow management, custom reporting, budgeting & forecasting, monthly financial packages, and outsourced controller/CFO support. Whether you're a startup or a growing company, we offer solutions designed to scale with your business needs. Contact us today to discover how we can help your business thrive!"
                          className="w-full p-2 border rounded"
                          rows={4}
                        />
                      </div>
                      
                      <button className="flex items-center text-blue-800 hover:text-blue-900">
                        <PlusCircle size={16} className="mr-1" />
                        Add Another Paragraph
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Call to Action Button</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            defaultValue="Contact Us"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Action
                          </label>
                          <select className="w-full p-2 border rounded">
                            <option value="contact">Scroll to Contact Form</option>
                            <option value="consultation">Open Consultation Form</option>
                            <option value="custom">Custom URL</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* About Us Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">About Us Content</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Company Description</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          About Us Text
                        </label>
                        <textarea
                          defaultValue={dashboardData.about}
                          className="w-full p-2 border rounded"
                          rows={6}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Services Content</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Services Section Header</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Our Small Business Services"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Service Items</h4>
                      
                      <div className="space-y-4">
                        {[
                          { title: 'Bookkeeping', description: 'Full-service bookkeeping including transaction coding and reconciliations' },
                          { title: 'Monthly Financial Package', description: 'Comprehensive monthly financial statements with analysis' },
                          { title: 'Cash Flow Management', description: 'Detailed cash flow tracking and forecasting' }
                        ].map((service, index) => (
                          <div key={index} className="bg-white p-4 rounded border">
                            <div className="flex justify-between">
                              <p className="font-medium">{service.title}</p>
                              <div>
                                <button className="text-blue-800 hover:text-blue-900 mr-2">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  Remove
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {service.description}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <button className="mt-4 flex items-center text-blue-800 hover:text-blue-900">
                        <PlusCircle size={16} className="mr-1" />
                        Add Service
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Contact Information</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Business Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Email
                          </label>
                          <input
                            type="email"
                            defaultValue="contact@wilcoxadvisors.com"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue="(555) 123-4567"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Business Address</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          defaultValue="123 Business Avenue, Suite 400"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            defaultValue="Metropolis"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            defaultValue="NY"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            defaultValue="10001"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded hover:bg-blue-800 mb-2 ${
        active ? 'bg-blue-800' : ''
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 flex items-center ${
        active 
          ? 'border-b-2 border-blue-800 text-blue-800' 
          : 'text-gray-600 hover:text-blue-800'
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}

export default AdminDashboard;
