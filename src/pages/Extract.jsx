import React, { useState } from 'react';
import { FileText, Upload, Wand2, Download, Eye, Settings } from 'lucide-react';

const Extract = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setExtractedData(null); // Reset previous results
    }
  };

  const handleExtraction = async () => {
    if (!uploadedFile) return;
    
    setIsExtracting(true);
    
    // Simulate extraction process
    setTimeout(() => {
      setExtractedData({
        fileName: uploadedFile.name,
        fileSize: (uploadedFile.size / 1024).toFixed(1) + ' KB',
        extractedFields: {
          'Document Title': 'Sample Document Analysis',
          'Date': new Date().toLocaleDateString(),
          'Author': 'System Generated',
          'Summary': 'This is a sample extracted summary from the uploaded document.',
          'Key Information': 'Important data points and insights extracted from the document.',
          'Word Count': '247 words',
          'Page Count': '1 page'
        }
      });
      setIsExtracting(false);
    }, 2000);
  };

  const downloadResults = (format) => {
    if (!extractedData) return;
    
    let content, filename, mimeType;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(extractedData, null, 2);
        filename = 'extracted_data.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        const headers = Object.keys(extractedData.extractedFields);
        const values = Object.values(extractedData.extractedFields);
        content = [headers.join(','), values.map(v => `"${v}"`).join(',')].join('\n');
        filename = 'extracted_data.csv';
        mimeType = 'text/csv';
        break;
      default:
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Extract Agent</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Configure your extraction settings and upload documents for AI-powered data extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Slice - Agent Configuration */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Agent Configuration
            </h2>

            {/* Basic Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Extraction Mode
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <input type="radio" name="extraction-mode" id="balanced" className="mr-3" defaultChecked />
                      <label htmlFor="balanced" className="font-medium text-gray-900 cursor-pointer">Balanced</label>
                    </div>
                    <span className="text-sm text-gray-500">10 cred. / page</span>
                  </div>
                  
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="extraction-mode" id="advanced" className="mr-3" />
                    <label htmlFor="advanced" className="font-medium text-gray-900 cursor-pointer">Advanced</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Schema Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Schema</h3>
              
              <div className="mb-4">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700">
                  <option>Custom</option>
                  <option>Invoice</option>
                  <option>Receipt</option>
                  <option>Contract</option>
                  <option>Resume</option>
                </select>
              </div>

              <button className="w-full mb-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Create Schema
              </button>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Upload a file or provide a natural language description to automatically generate a schema.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Auto-Generate
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Create Manually
                  </button>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Credits Remaining</span>
                  <span className="text-sm text-gray-800 font-medium">1,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm text-gray-800 font-medium">99.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Slice - File Upload */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors mb-6">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                multiple
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Drag and drop files here, or click to select files</h3>
                <p className="text-gray-500 mb-4">
                  Upload a single file to verify your extraction, or run a bulk extraction on multiple files asynchronously.
                </p>
                <p className="text-sm text-gray-400">
                  Supports: PDF, Images (PNG, JPG), Text files, Word documents
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-blue-800 font-medium">{uploadedFile.name}</p>
                    <p className="text-blue-600 text-sm">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleExtraction}
              disabled={!uploadedFile || isExtracting}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg font-semibold mb-6"
            >
              {isExtracting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Extracting...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Run Extract
                </>
              )}
            </button>

            {/* Results Section */}
            {extractedData && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Extraction Results
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadResults('json')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      JSON
                    </button>
                    <button
                      onClick={() => downloadResults('csv')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-700 mb-2">File Information</h4>
                    <p className="text-sm text-gray-600">File: {extractedData.fileName}</p>
                    <p className="text-sm text-gray-600">Size: {extractedData.fileSize}</p>
                  </div>

                  {Object.entries(extractedData.extractedFields).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-800 mb-1 text-sm">{key}</h4>
                      <p className="text-gray-600 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extract;