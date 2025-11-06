import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GoldEarringsHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: "Gold Earrings For Women",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      subtitle: "Explore Jewelry Wholesale & Online Marketplace"
    },
    {
      title: "Diamond Studded Collection",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      subtitle: "Handcrafted Elegance For Every Occasion"
    },
    {
      title: "Premium Gold Jewelry",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      subtitle: "Timeless Designs That Shine Forever"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  return (
   <div
  className="relative w-full  h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 overflow-hidden"
  style={{
    backgroundImage: `url(${slides[currentSlide].image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    
  }}
>  {/* Navigation Arrows */}
      <button 
        onClick={() => {
          prevSlide();
          setIsAutoPlaying(false);
        }}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      
      <button 
        onClick={() => {
          nextSlide();
          setIsAutoPlaying(false);
        }}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                ? 'opacity-0 -translate-x-full' 
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="container mx-auto h-full flex items-center px-8 lg:px-16">
             <div className="grid grid-cols-1 mx-10 lg:grid-cols-[60%_40%] gap-12 items-center w-full">

                {/* Left Content */}
                <div className={`space-y-6 z-10  transition-all duration-1000 delay-300 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}>
                  <p className="text-sm uppercase tracking-widest text-amber-700 font-medium animate-slideInLeft">
                    {slide.subtitle}
                  </p>
                  
                  <h1 className="text-5xl lg:text-7xl font-serif text-white leading-tight animate-slideInLeft animation-delay-200">
                    {slide.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 max-w-md animate-slideInLeft animation-delay-400">
                    {slide.description}
                  </p>
                  
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-slideInLeft animation-delay-600">
                    Shop Now
                  </button>
                </div>

                {/* Right Image */}
                {/* <div className="relative h-full min-h-[500px] lg:min-h-full">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-50/50 z-10"></div>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
                      index === currentSlide 
                        ? 'scale-100 opacity-100' 
                        : 'scale-110 opacity-0'
                    }`}
                  />
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-amber-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}