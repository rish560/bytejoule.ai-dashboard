import React, { useState } from 'react';
import { ArrowLeft, Settings, Zap, Crown, Save, Upload, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Parse = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('cost-effective');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const parsingModes = [
    {
      id: 'cost-effective',
      name: 'Cost-effective',
      description: 'Optimized for efficiency and low cost processing',
      icon: Settings,
      features: ['Basic parsing', 'Standard accuracy', 'Low cost per document']
    },
    {
      id: 'agentic',
      name: 'Agentic',
      description: 'AI-powered intelligent parsing with context awareness',
      icon: Zap,
      features: ['Smart parsing', 'High accuracy', 'Context understanding']
    },
    {
      id: 'agentic-plus',
      name: 'Agentic Plus',
      description: 'Premium parsing with advanced AI capabilities',
      icon: Crown,
      features: ['Advanced AI parsing', 'Highest accuracy', 'Multi-modal support']
    }
  ];

  const useCasePresets = [
    { id: 'invoices', name: 'Invoice Processing', description: 'Extract invoice data with line items' },
    { id: 'contracts', name: 'Contract Analysis', description: 'Parse legal documents and contracts' },
    { id: 'resumes', name: 'Resume Parsing', description: 'Extract candidate information' },
    { id: 'medical', name: 'Medical Records', description: 'Process healthcare documents' },
    { id: 'financial', name: 'Financial Reports', description: 'Parse financial statements' },
    { id: 'custom', name: 'Custom Configuration', description: 'Create your own parsing rules' }
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parse Configuration</h1>
        <p className="text-gray-600">
          Configure advanced parsing settings and choose the optimal mode for your documents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-8">
          {/* Advanced Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Language
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Auto-detect</option>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>JSON</option>
                  <option>XML</option>
                  <option>CSV</option>
                  <option>YAML</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Enable OCR for scanned documents</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Preserve original formatting</span>
                </label>
              </div>
            </div>
          </div>

          {/* Recommended Parsing Modes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Parsing Modes</h2>
            
            <div className="space-y-4">
              {parsingModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <div
                    key={mode.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMode === mode.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-white rounded-lg mr-4">
                        <Icon size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{mode.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {mode.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="ml-4">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedMode === mode.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload-parse"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.png,.txt"
              />
              <label htmlFor="file-upload-parse" className="cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, DOC, DOCX, JPG, PNG, TXT
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

          {/* Use-case Presets */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Use-case Presets</h3>
            <div className="space-y-3">
              {useCasePresets.map((preset) => (
                <div
                  key={preset.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedPreset === preset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  <h4 className="font-medium text-gray-900 text-sm">{preset.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Save Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Save size={20} className="mr-2" />
              Save Configuration
            </button>
            
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Load from template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parse;