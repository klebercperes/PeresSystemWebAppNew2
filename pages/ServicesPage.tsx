import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  detailedDescription?: string;
}

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
    detailedDescription: 'Transform your business with our comprehensive cloud solutions. We help you migrate to the cloud, optimize your infrastructure, and ensure maximum uptime. Our team works with AWS, Azure, and Google Cloud to provide the best solution for your needs. From initial assessment to ongoing management, we handle every aspect of your cloud journey.',
    imageUrl: 'https://picsum.photos/800/500?random=1',
    icon: CloudIcon
  },
  {
    id: 2,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with our comprehensive security services, from threat detection to incident response.',
    detailedDescription: 'In today\'s digital landscape, cybersecurity is paramount. Our expert team provides end-to-end security solutions including vulnerability assessments, penetration testing, security monitoring, and incident response. We implement multi-layered defense strategies to protect your data, systems, and reputation. Stay ahead of threats with our 24/7 security operations center.',
    imageUrl: 'https://picsum.photos/800/500?random=2',
    icon: ShieldIcon
  },
  {
    id: 3,
    title: 'Managed Databases',
    description: 'Expert management of your database systems, ensuring high availability, performance, and security.',
    detailedDescription: 'Keep your databases running at peak performance with our managed database services. We handle installation, configuration, optimization, backup, and recovery for SQL and NoSQL databases. Our team ensures high availability, data integrity, and security compliance. Focus on your business while we manage your critical data infrastructure.',
    imageUrl: 'https://picsum.photos/800/500?random=3',
    icon: DatabaseIcon
  },
  {
    id: 4,
    title: '24/7 IT Support',
    description: 'Our dedicated support team is always available to resolve your technical issues and keep your business running smoothly.',
    detailedDescription: 'Never face IT challenges alone. Our 24/7 support team is ready to help whenever you need it. From troubleshooting technical issues to providing strategic IT guidance, we ensure your systems stay operational. With multiple support tiers and guaranteed response times, we keep your business running smoothly around the clock.',
    imageUrl: 'https://picsum.photos/800/500?random=4',
    icon: HeadsetIcon
  },
  {
    id: 5,
    title: 'Network Infrastructure',
    description: 'Design, implementation, and management of robust and reliable network solutions for your enterprise.',
    detailedDescription: 'Build a network infrastructure that scales with your business. We design, implement, and manage wired and wireless networks that are secure, fast, and reliable. From small office setups to enterprise-wide deployments, we ensure optimal performance and security. Our solutions include network monitoring, optimization, and ongoing maintenance.',
    imageUrl: 'https://picsum.photos/800/500?random=5',
    icon: NetworkIcon
  },
  {
    id: 6,
    title: 'Custom Software Dev',
    description: 'Bespoke software solutions designed to meet your unique business challenges and goals.',
    detailedDescription: 'Turn your ideas into powerful software solutions. Our development team creates custom applications tailored to your specific business needs. From web applications to mobile apps and enterprise software, we deliver solutions that integrate seamlessly with your existing systems. We follow agile methodologies to ensure timely delivery and continuous improvement.',
    imageUrl: 'https://picsum.photos/800/500?random=6',
    icon: CodeIcon
  },
];

interface ServicesPageProps {
  onLoginClick: () => void;
  onContactClick: () => void;
  onHomeClick?: () => void;
  serviceId?: number;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onLoginClick, onContactClick, onHomeClick, serviceId }) => {
  useEffect(() => {
    // Scroll to specific service if serviceId is provided
    if (serviceId) {
      setTimeout(() => {
        const serviceElement = document.getElementById(`service-${serviceId}`);
        if (serviceElement) {
          serviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [serviceId]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        isAuthenticated={false} 
        onLoginClick={onLoginClick}
        onLogoutClick={() => {}}
        onHomeClick={onHomeClick}
        onServicesClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onContactClick={onContactClick}
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Our Services
            </h1>
            <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
              Comprehensive IT solutions designed to help your business thrive in the digital age.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">
              {servicesData.map((service, index) => {
                const Icon = service.icon;
                const isEven = index % 2 === 0;
                const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <div
                    key={service.id}
                    id={`service-${service.id}`}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center scroll-mt-20`}
                  >
                    <div className={`flex-1 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-600 rounded-full mr-4">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                          {service.title}
                        </h2>
                      </div>
                      <p className="text-lg text-gray-600 mb-4">
                        {service.description}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {service.detailedDescription || service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ServicesPage;

