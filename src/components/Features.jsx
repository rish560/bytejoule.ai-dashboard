import React from 'react';
import { FileText, Search, Database, Tag, Zap, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Document Parsing',
      description: 'AI-powered parsing with multiple modes from cost-effective to premium agentic processing for any document type.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Search,
      title: 'Intelligent Data Extraction',
      description: 'Extract structured data from unstructured documents with custom schemas and validation rules.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Database,
      title: 'Scalable Indexing',
      description: 'Build vector and keyword indexes for lightning-fast search and retrieval across massive document libraries.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Tag,
      title: 'Auto Classification',
      description: 'Automatically classify documents using ML models with customizable rules and confidence thresholds.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Process documents in real-time with enterprise-grade performance and 99.9% uptime guarantee.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance, end-to-end encryption, and role-based access controls.',
      gradient: 'from-gray-600 to-gray-800'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Workflows
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your document processing pipeline with cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>

                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity duration-200 transform hover:scale-105">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;