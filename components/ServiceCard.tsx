
import React from 'react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onServiceClick?: (serviceId: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onServiceClick }) => {
  const Icon = service.icon;

  const handleClick = () => {
    if (onServiceClick) {
      onServiceClick(service.id);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col cursor-pointer"
    >
      <img className="w-full h-48 object-cover" src={service.imageUrl} alt={service.title} />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-blue-600 rounded-full mr-4">
              <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
        </div>
        <p className="text-gray-600 flex-grow">{service.description}</p>
        {onServiceClick && (
          <div className="mt-4 text-blue-600 font-medium text-sm hover:text-blue-800">
            Learn more →
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
