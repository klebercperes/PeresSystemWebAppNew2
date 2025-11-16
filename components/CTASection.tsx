import React from 'react';

interface CTASectionProps {
  onGetStartedClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStartedClick }) => {
  return (
    <section className="py-16 md:py-24 bg-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your IT Infrastructure?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Let's discuss how Peres Systems can help streamline your operations and drive your business forward.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onGetStartedClick ? (
            <button
              onClick={onGetStartedClick}
              className="inline-block bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Today
            </button>
          ) : (
            <a
              href="mailto:info@peres.systems"
              className="inline-block bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Us
            </a>
          )}
          <a
            href="tel:+61481943940"
            className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

