import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import axios from 'axios';

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

function ConsultationFormModal({ setShowConsultationForm }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '', industry: '', yearsInBusiness: '', revenueRange: '', services: [],
    contactName: '', email: '', phone: '', preferredContact: '', preferredTime: '', notes: '',
  });

  const isStepValid = () => {
    const fields = formSteps[currentStep].fields;
    return fields.every(field => 
      field.required 
        ? (field.type === 'services' ? formData.services.length > 0 : formData[field.name]?.trim() !== '') 
        : true
    );
  };

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

  return (
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
  );
}

export default ConsultationFormModal;
