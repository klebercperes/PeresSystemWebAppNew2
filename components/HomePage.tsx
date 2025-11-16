import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import ServicesGrid from './ServicesGrid';
import WhyChooseUs from './WhyChooseUs';
import CTASection from './CTASection';
import Footer from './Footer';
import BackToTop from './BackToTop';

interface HomePageProps {
  onLoginClick: () => void;
  onServicesClick?: (serviceId?: number) => void;
  onContactClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onServicesClick, onContactClick }) => {
  const handleGetStarted = () => {
    // Scroll to CTA section or trigger login
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onLoginClick();
    }
  };

  const handleServiceClick = (serviceId: number) => {
    if (onServicesClick) {
      onServicesClick(serviceId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={false} 
        onLoginClick={onLoginClick}
        onLogoutClick={() => {}}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onServicesClick={() => onServicesClick && onServicesClick()}
        onContactClick={onContactClick}
      />
      <main className="flex-grow">
        <HeroSection onGetStartedClick={handleGetStarted} />
        <StatsSection />
        <ServicesGrid onServiceClick={handleServiceClick} />
        <WhyChooseUs />
        <div id="cta">
          <CTASection onGetStartedClick={handleGetStarted} />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomePage;

