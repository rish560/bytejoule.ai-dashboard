import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import { FileText, Search, Database, Tag, Heart, DollarSign, Truck, Factory, ShoppingCart, Building } from 'lucide-react';

const actionCards = [
  {
    id: 'parse',
    title: 'Parse',
    description: 'Advanced document parsing with AI-powered extraction and processing capabilities tailored for your industry.',
    icon: FileText,
    path: '/parse'
  },
  {
    id: 'extract',
    title: 'Extract',
    description: 'Intelligent data extraction from industry-specific document formats with custom schemas.',
    icon: Search,
    path: '/extract'
  },
  {
    id: 'index',
    title: 'Index',
    description: 'Build scalable data pipelines optimized for your industry requirements and compliance needs.',
    icon: Database,
    path: '/index'
  },
  {
    id: 'classify',
    title: 'Classify',
    description: 'Automated document classification using industry-specific models and regulatory standards.',
    icon: Tag,
    path: '/classify'
  }
];

const categoryInfo = {
  '/healthcare': {
    title: 'Healthcare Revolution',
    description: 'AI-powered solutions for healthcare data processing, patient records management, and medical document analysis with HIPAA compliance.',
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    accent: 'red'
  },
  '/financial': {
    title: 'Financial Intelligence',
    description: 'Advanced financial data analysis, fraud detection, automated reporting, and regulatory compliance solutions.',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    accent: 'green'
  },
  '/supply-chain': {
    title: 'Supply Chain & Logistics',
    description: 'Optimize supply chain operations with intelligent logistics management, inventory tracking, and predictive analytics.',
    icon: Truck,
    color: 'from-blue-500 to-cyan-600',
    accent: 'blue'
  },
  '/manufacturing': {
    title: 'Manufacturing',
    description: 'Smart manufacturing solutions with quality control, production optimization, and predictive maintenance.',
    icon: Factory,
    color: 'from-gray-600 to-slate-700',
    accent: 'gray'
  },
  '/retail': {
    title: 'Retail & E-commerce',
    description: 'E-commerce analytics, customer insights, inventory management, and personalization for retail businesses.',
    icon: ShoppingCart,
    color: 'from-purple-500 to-violet-600',
    accent: 'purple'
  },
  '/enterprise': {
    title: 'Enterprise',
    description: 'Enterprise-grade solutions for large-scale data processing, business intelligence, and workflow automation.',
    icon: Building,
    color: 'from-indigo-500 to-blue-600',
    accent: 'indigo'
  }
};

const Category = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const category = categoryInfo[location.pathname] || categoryInfo['/enterprise'];
  const CategoryIcon = category.icon;

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-6">
          <div className={`p-4 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg shadow-${category.accent}-500/25 mr-4`}>
            <CategoryIcon size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {category.title}
            </h1>
            <p className="text-lg text-gray-600">
              Industry-specific AI solutions
            </p>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {actionCards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            onClick={() => handleCardClick(card.path)}
          />
        ))}
      </div>

      {/* Industry-specific Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8 shadow-lg shadow-blue-500/5">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className={`p-2 bg-gradient-to-r ${category.color} rounded-xl mr-3 shadow-lg`}>
              <CategoryIcon size={24} className="text-white" />
            </div>
            Getting Started
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0 mt-1">1</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Configure Data Sources</h4>
                <p className="text-gray-600 text-sm">Connect your existing systems and data repositories.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0 mt-1">2</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Set Up Processing Rules</h4>
                <p className="text-gray-600 text-sm">Define industry-specific parsing and extraction rules.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0 mt-1">3</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Deploy & Monitor</h4>
                <p className="text-gray-600 text-sm">Launch your pipeline and monitor performance metrics.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8 shadow-lg shadow-blue-500/5">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Industry Best Practices</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2">Compliance & Security</h4>
              <p className="text-gray-600 text-sm">Ensure regulatory compliance with built-in security measures and audit trails.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <h4 className="font-semibold text-gray-900 mb-2">Performance Optimization</h4>
              <p className="text-gray-600 text-sm">Start with small datasets and gradually scale based on performance metrics.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
              <p className="text-gray-600 text-sm">Implement validation workflows and monitor accuracy rates continuously.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8 shadow-lg shadow-blue-500/5">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Industry Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`inline-flex p-4 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg mb-3`}>
              <FileText size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">5.2M+</div>
            <div className="text-sm text-gray-600">Documents Processed</div>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex p-4 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg mb-3`}>
              <Database size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">99.8%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex p-4 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg mb-3`}>
              <Search size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">35ms</div>
            <div className="text-sm text-gray-600">Avg Processing Time</div>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex p-4 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg mb-3`}>
              <Tag size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;