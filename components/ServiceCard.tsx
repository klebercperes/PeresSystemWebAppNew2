
import React from 'react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = service.icon;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
      <img className="w-full h-48 object-cover" src={service.imageUrl} alt={service.title} />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-secondary rounded-full mr-4">
              <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-dark">{service.title}</h3>
        </div>
        <p className="text-neutral flex-grow">{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
