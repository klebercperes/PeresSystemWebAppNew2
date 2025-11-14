
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-primary text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
         <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://picsum.photos/1600/800?blur=5&grayscale')" }}>
        </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          Reliable IT Solutions for Modern Businesses
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-8">
          Peres Systems provides cutting-edge technology services to streamline your operations, enhance security, and drive growth.
        </p>
        <a
          href="#services"
          className="inline-block bg-accent text-primary-dark font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-105"
        >
          Explore Our Services
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
