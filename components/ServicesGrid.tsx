
import React from 'react';
import ServiceCard from './ServiceCard';
import type { Service } from '../types';

const CloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const DatabaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const HeadsetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
);

const NetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>
);

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);


const servicesData: Service[] = [
  {
    id: 1,
    title: 'Cloud Solutions',
    description: 'Scalable and secure cloud infrastructure to power your applications. We partner with major providers to offer tailored solutions.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    icon: CloudIcon
  },
  {
    id: 2,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with our comprehensive security services, from threat detection to incident response.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    icon: ShieldIcon
  },
  {
    id: 3,
    title: 'Managed Databases',
    description: 'Expert management of your database systems, ensuring high availability, performance, and security.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    icon: DatabaseIcon
  },
  {
    id: 4,
    title: '24/7 IT Support',
    description: 'Our dedicated support team is always available to resolve your technical issues and keep your business running smoothly.',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    icon: HeadsetIcon
  },
   {
    id: 5,
    title: 'Network Infrastructure',
    description: 'Design, implementation, and management of robust and reliable network solutions for your enterprise.',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    icon: NetworkIcon
  },
   {
    id: 6,
    title: 'Custom Software Dev',
    description: 'Bespoke software solutions designed to meet your unique business challenges and goals.',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    icon: CodeIcon
  },
];

interface ServicesGridProps {
  onServiceClick?: (serviceId: number) => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ onServiceClick }) => {
  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive suite of IT services designed to meet the needs of businesses of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ServiceCard service={service} onServiceClick={onServiceClick} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default ServicesGrid;
