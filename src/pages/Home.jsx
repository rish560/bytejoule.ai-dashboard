import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { FileText, Search, Database, Tag, Activity, BarChart3, Clock, Users } from 'lucide-react';

const actionCards = [
  {
    id: 'parse',
    title: 'Parse Documents',
    description: 'Extract structured data from documents using advanced AI parsing capabilities.',
    icon: FileText,
    path: '/parse'
  },
  {
    id: 'extract',
    title: 'Extract Data',
    description: 'Intelligent data extraction from various formats with customizable schemas.',
    icon: Search,
    path: '/extract'
  },
  {
    id: 'index',
    title: 'Build Indexes',
    description: 'Create searchable indexes for fast content retrieval and discovery.',
    icon: Database,
    path: '/index'
  },
  {
    id: 'classify',
    title: 'Classify Content',
    description: 'Automatically categorize documents using machine learning models.',
    icon: Tag,
    path: '/classify'
  }
];

const statsCards = [
  {
    title: 'Documents Processed',
    value: '1,234',
    change: '+12%',
    icon: FileText,
    color: 'blue'
  },
  {
    title: 'Active Indexes',
    value: '12',
    change: 'Active',
    icon: Database,
    color: 'green'
  },
  {
    title: 'Classification Accuracy',
    value: '98.7%',
    change: 'Last 7 days',
    icon: BarChart3,
    color: 'purple'
  },
  {
    title: 'Average Response Time',
    value: '45ms',
    change: 'Real-time',
    icon: Clock,
    color: 'orange'
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Byte Joule
        </h1>
        <p className="text-gray-600">
          AI-powered document intelligence platform for modern enterprises
        </p>
      </div>

      {/* Action Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50' :
                  stat.color === 'green' ? 'bg-green-50' :
                  stat.color === 'purple' ? 'bg-purple-50' :
                  'bg-orange-50'
                }`}>
                  <stat.icon size={20} className={
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  } />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                  stat.color === 'green' ? 'bg-green-50 text-green-700' :
                  stat.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                  'bg-orange-50 text-orange-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload Document</p>
                <p className="text-sm text-gray-600">Process a new document</p>
              </div>
            </div>
          </button>

          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Database size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Index</p>
                <p className="text-sm text-gray-600">Build a new search index</p>
              </div>
            </div>
          </button>

          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Tag size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Classification Rule</p>
                <p className="text-sm text-gray-600">Create new classification rules</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;