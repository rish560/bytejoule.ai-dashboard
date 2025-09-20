import React from 'react';
import { Code, Cpu, Layers, Rocket, ArrowRight } from 'lucide-react';

const TechSection = () => {
  const techFeatures = [
    {
      icon: Code,
      title: 'Advanced AI Models',
      description: 'Powered by state-of-the-art transformer models and custom-trained neural networks for maximum accuracy.'
    },
    {
      icon: Cpu,
      title: 'Edge Computing',
      description: 'Distributed processing across global edge nodes for ultra-low latency and enhanced data privacy.'
    },
    {
      icon: Layers,
      title: 'Microservices Architecture',
      description: 'Scalable, fault-tolerant infrastructure that grows with your business needs and handles enterprise workloads.'
    },
    {
      icon: Rocket,
      title: 'Real-time APIs',
      description: 'RESTful and GraphQL APIs with WebSocket support for real-time document processing and status updates.'
    }
  ];

  return (
    <section id="technology" className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-8">
              <Cpu size={16} className="mr-2" />
              Next-Generation Technology
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Built for the
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Future of AI
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Our platform leverages cutting-edge machine learning and cloud infrastructure to deliver unparalleled performance and reliability.
            </p>

            <div className="space-y-6 mb-8">
              {techFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
              <span>Explore Architecture</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Side - Tech Visualization */}
          <div className="relative">
            {/* Main Glass Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-60 animate-pulse animation-delay-300"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                    <Code size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">AI Engine</h3>
                  <p className="text-gray-400">Real-time Processing</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">50ms</div>
                    <div className="text-sm text-gray-400">Latency</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">10TB</div>
                    <div className="text-sm text-gray-400">Per Day</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Support</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Processing Power</span>
                      <span>95%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Accuracy</span>
                      <span>99%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-[99%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full animate-ping animation-delay-1000"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping animation-delay-1500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;