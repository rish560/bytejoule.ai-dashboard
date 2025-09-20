import React, { useState } from 'react';
import { ArrowLeft, Database, Plus, Search, Settings, Zap, BarChart, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [selectedIndexType, setSelectedIndexType] = useState('vector');
  const [uploadedFile, setUploadedFile] = useState(null);

  const indexTypes = [
    {
      id: 'vector',
      name: 'Vector Index',
      description: 'Semantic search with embeddings',
      icon: Zap,
      features: ['Semantic similarity', 'Multi-language support', 'Fast retrieval'],
      useCase: 'Best for: Document search, Q&A systems, content discovery'
    },
    {
      id: 'keyword',
      name: 'Keyword Index',
      description: 'Traditional full-text search',
      icon: Search,
      features: ['Exact matching', 'Boolean queries', 'Faceted search'],
      useCase: 'Best for: Precise searches, catalog lookup, structured data'
    },
    {
      id: 'hybrid',
      name: 'Hybrid Index',
      description: 'Combines vector and keyword search',
      icon: Database,
      features: ['Best of both worlds', 'Weighted scoring', 'Advanced filtering'],
      useCase: 'Best for: Enterprise search, complex queries, comprehensive results'
    }
  ];

  const existingIndexes = [
    {
      name: 'Product Catalog',
      type: 'Keyword',
      documents: '15.2K',
      status: 'Active',
      lastUpdated: '2 hours ago'
    },
    {
      name: 'Customer Support',
      type: 'Vector',
      documents: '8.7K',
      status: 'Indexing',
      lastUpdated: '1 day ago'
    },
    {
      name: 'Legal Documents',
      type: 'Hybrid',
      documents: '3.1K',
      status: 'Active',
      lastUpdated: '3 days ago'
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Index</h1>
        <p className="text-gray-600">
          Build scalable data pipelines and searchable indexes for your content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Index Type Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Index Type</h2>
            
            <div className="space-y-4">
              {indexTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedIndexType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedIndexType(type.id)}
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-white rounded-lg mr-4">
                        <Icon size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {type.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-blue-600 font-medium">{type.useCase}</p>
                      </div>
                      <div className="ml-4">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedIndexType === type.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Index Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Index Name
                </label>
                <input
                  type="text"
                  placeholder="Enter index name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Source
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Upload Files</option>
                  <option>Database Connection</option>
                  <option>API Endpoint</option>
                  <option>Cloud Storage</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chunk Size
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>512 tokens</option>
                    <option>1024 tokens</option>
                    <option>2048 tokens</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlap
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>10%</option>
                    <option>20%</option>
                    <option>30%</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Embedding Model
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>text-embedding-ada-002</option>
                  <option>text-embedding-3-small</option>
                  <option>text-embedding-3-large</option>
                  <option>Custom Model</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Enable metadata extraction</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Auto-update on source changes</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Enable version control</span>
                </label>
              </div>
            </div>
          </div>

          {/* Existing Indexes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Indexes</h2>
            
            <div className="space-y-4">
              {existingIndexes.map((index, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Database size={20} className="text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{index.name}</h3>
                      <p className="text-sm text-gray-500">{index.type} • {index.documents} documents</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        index.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {index.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{index.lastUpdated}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Settings size={16} />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload-index"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.json,.csv"
                multiple
              />
              <label htmlFor="file-upload-index" className="cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your files here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, DOC, DOCX, TXT, JSON, CSV
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

          {/* Pipeline Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Data Ingestion</p>
                  <p className="text-xs text-gray-600">Load and preprocess documents</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Text Processing</p>
                  <p className="text-xs text-gray-600">Chunk and clean content</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Embedding Generation</p>
                  <p className="text-xs text-gray-600">Create vector representations</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Index Creation</p>
                  <p className="text-xs text-gray-600">Build searchable index</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart size={16} className="text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Avg. Query Time</span>
                </div>
                <span className="text-sm font-medium text-gray-900">45ms</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database size={16} className="text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Storage Used</span>
                </div>
                <span className="text-sm font-medium text-gray-900">2.4 GB</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Search size={16} className="text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Daily Queries</span>
                </div>
                <span className="text-sm font-medium text-gray-900">1,247</span>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus size={20} className="mr-2" />
            Create Index
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;