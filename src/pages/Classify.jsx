import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, CreditCard, ScrollText, User, Heart, Tag, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Classify = () => {
  const navigate = useNavigate();
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const quickAddTemplates = [
    {
      id: 'invoice',
      name: 'Invoice',
      description: 'Automatically classify invoice documents',
      icon: FileText,
      color: 'blue',
      rules: ['Contains invoice number', 'Has billing details', 'Shows line items']
    },
    {
      id: 'receipt',
      name: 'Receipt',
      description: 'Identify purchase receipts and transaction records',
      icon: CreditCard,
      color: 'green',
      rules: ['Contains store name', 'Has total amount', 'Shows purchase date']
    },
    {
      id: 'contract',
      name: 'Contract',
      description: 'Classify legal contracts and agreements',
      icon: ScrollText,
      color: 'purple',
      rules: ['Contains party names', 'Has signature blocks', 'Includes terms']
    },
    {
      id: 'resume',
      name: 'Resume',
      description: 'Identify candidate resumes and CVs',
      icon: User,
      color: 'orange',
      rules: ['Contains contact info', 'Has work experience', 'Lists education']
    },
    {
      id: 'medical',
      name: 'Medical Record',
      description: 'Classify medical documents and health records',
      icon: Heart,
      color: 'red',
      rules: ['Contains patient info', 'Has medical terms', 'Includes dates']
    }
  ];

  const [customRules, setCustomRules] = useState([
    {
      id: 1,
      name: 'Financial Report',
      conditions: ['Contains "Balance Sheet"', 'Has financial figures', 'Includes company header'],
      confidence: 85
    }
  ]);

  const toggleTemplate = (templateId) => {
    setSelectedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const addCustomRule = () => {
    const newRule = {
      id: customRules.length + 1,
      name: 'New Classification Rule',
      conditions: ['Add your conditions here'],
      confidence: 70
    };
    setCustomRules([...customRules, newRule]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Classification Rules</h1>
        <p className="text-gray-600">
          Set up automated document classification with predefined templates or custom rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Add Templates */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Add Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickAddTemplates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplates.includes(template.id);
                
                return (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleTemplate(template.id)}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 bg-${template.color}-50`}>
                        <Icon size={20} className={`text-${template.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="space-y-1">
                          {template.rules.map((rule, index) => (
                            <p key={index} className="text-xs text-gray-500">• {rule}</p>
                          ))}
                        </div>
                      </div>
                      <div className="ml-2">
                        <div className={`w-4 h-4 rounded border-2 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addCustomRule}
              className="mt-6 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <Plus size={20} className="mx-auto mb-2" />
              <span className="block text-sm font-medium">Add Custom Rule</span>
            </button>
          </div>

          {/* Custom Classification Rules */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Custom Classification Rules</h2>
            
            <div className="space-y-4">
              {customRules.map((rule) => (
                <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Confidence:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rule.confidence >= 80 
                          ? 'bg-green-100 text-green-800'
                          : rule.confidence >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Conditions:</p>
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Tag size={14} className="mr-2 text-gray-400" />
                        {condition}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors">
                      Test
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Classification</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload-classify"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
              <label htmlFor="file-upload-classify" className="cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Upload a document to test classification
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <FileText size={16} className="text-green-600 mr-2" />
                  <span className="text-sm text-green-800">{uploadedFile.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Classification Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Confidence
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>50%</option>
                  <option>60%</option>
                  <option>70%</option>
                  <option>80%</option>
                  <option>90%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Category
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Unclassified</option>
                  <option>Manual Review</option>
                  <option>Archive</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Auto-learn from feedback</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Enable fuzzy matching</span>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Rules</span>
                <span className="text-sm font-medium text-gray-900">{customRules.length + selectedTemplates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Documents Classified</span>
                <span className="text-sm font-medium text-gray-900">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Confidence</span>
                <span className="text-sm font-medium text-green-600">87%</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Save Classification Rules
          </button>
        </div>
      </div>
    </div>
  );
};

export default Classify;