import React from 'react';
import { ArrowRight } from 'lucide-react';

const Card = ({ title, description, icon: Icon, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white rounded-lg border border-gray-200 p-6 
        hover:shadow-md transition-all duration-200 cursor-pointer
        hover:border-gray-300 h-full flex flex-col ${className}
      `}
    >
      {/* Icon */}
      {Icon && (
        <div className="mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon size={20} className="text-blue-600" />
          </div>
        </div>
      )}
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
          {description}
        </p>
      )}
      
      {/* Action */}
      <div className="flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
        <span className="mr-1">Learn more</span>
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </div>
  );
};

export default Card;