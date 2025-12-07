// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function GoldEarringsHero() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   const slides = [
//     {
//       title: "Gold Earrings For Women",
//       image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
//       subtitle: "Explore Jewelry Wholesale & Online Marketplace"
//     },
//     {
//       title: "Diamond Studded Collection",
//       image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
//       subtitle: "Handcrafted Elegance For Every Occasion"
//     },
//     {
//       title: "Premium Gold Jewelry",
//       image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
//       subtitle: "Timeless Designs That Shine Forever"
//     }
//   ];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     setIsAutoPlaying(false);
//   };

//   // Auto-play functionality
//   useEffect(() => {
//     if (!isAutoPlaying) return;
    
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 4000); // Change slide every 4 seconds

//     return () => clearInterval(interval);
//   }, [isAutoPlaying, slides.length]);

//   return (
//    <div
//   className="relative w-full  h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 overflow-hidden"
//   style={{
//     backgroundImage: `url(${slides[currentSlide].image})`,
//     backgroundRepeat: 'no-repeat',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
    
//   }}
// >  {/* Navigation Arrows */}
//       <button 
//         onClick={() => {
//           prevSlide();
//           setIsAutoPlaying(false);
//         }}
//         className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
//       >
//         <ChevronLeft className="w-6 h-6 text-gray-800" />
//       </button>
      
//       <button 
//         onClick={() => {
//           nextSlide();
//           setIsAutoPlaying(false);
//         }}
//         className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
//       >
//         <ChevronRight className="w-6 h-6 text-gray-800" />
//       </button>

//       {/* Slides */}
//       <div className="relative w-full h-full">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-all duration-700 ${
//               index === currentSlide 
//                 ? 'opacity-100 translate-x-0' 
//                 : index < currentSlide 
//                 ? 'opacity-0 -translate-x-full' 
//                 : 'opacity-0 translate-x-full'
//             }`}
//           >
//             <div className="container mx-auto h-full flex items-center px-8 lg:px-16">
//              <div className="grid grid-cols-1 mx-10 lg:grid-cols-[60%_40%] gap-12 items-center w-full">

//                 {/* Left Content */}
//                 <div className={`space-y-6 z-10  transition-all duration-1000 delay-300 ${
//                   index === currentSlide 
//                     ? 'opacity-100 translate-y-0' 
//                     : 'opacity-0 translate-y-10'
//                 }`}>
//                   <p className="text-sm uppercase tracking-widest text-amber-700 font-medium animate-slideInLeft">
//                     {slide.subtitle}
//                   </p>
                  
//                   <h1 className="text-5xl lg:text-7xl font-serif text-white leading-tight animate-slideInLeft animation-delay-200">
//                     {slide.title}
//                   </h1>
                  
//                   <p className="text-lg text-gray-600 max-w-md animate-slideInLeft animation-delay-400">
//                     {slide.description}
//                   </p>
                  
//                   <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-slideInLeft animation-delay-600">
//                     Shop Now
//                   </button>
//                 </div>

//                 {/* Right Image */}
//                 {/* <div className="relative h-full min-h-[500px] lg:min-h-full">
//                   <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-amber-50/50 z-10"></div>
//                   <img
//                     src={slide.image}
//                     alt={slide.title}
//                     className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
//                       index === currentSlide 
//                         ? 'scale-100 opacity-100' 
//                         : 'scale-110 opacity-0'
//                     }`}
//                   />
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Indicator Dots */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
//               index === currentSlide 
//                 ? 'bg-amber-600 w-8' 
//                 : 'bg-gray-300 hover:bg-gray-400'
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       <style jsx>{`
//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         .animate-slideInLeft {
//           animation: slideInLeft 0.8s ease-out forwards;
//         }
        
//         .animation-delay-200 {
//           animation-delay: 0.2s;
//           opacity: 0;
//         }
        
//         .animation-delay-400 {
//           animation-delay: 0.4s;
//           opacity: 0;
//         }
        
//         .animation-delay-600 {
//           animation-delay: 0.6s;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function GoldEarringsHero() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   const slides = [
//     {
//       title: "Gold Earrings For Women",
//       image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
//       subtitle: "Explore Jewelry Wholesale & Online Marketplace"
//     },
//     {
//       title: "Diamond Studded Collection",
//       image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
//       subtitle: "Handcrafted Elegance For Every Occasion"
//     },
//     {
//       title: "Premium Gold Jewelry",
//       image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
//       subtitle: "Timeless Designs That Shine Forever"
//     }
//   ];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     setIsAutoPlaying(false);
//   };

//   useEffect(() => {
//     if (!isAutoPlaying) return;
    
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [isAutoPlaying, slides.length]);

//   return (
//     <div
//       className="relative w-full h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 overflow-hidden"
//       style={{
//         backgroundImage: `url(${slides[currentSlide].image})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Gradient Overlay for better text visibility */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-0"></div>
      
//       {/* Decorative Elements */}
//       <div className="absolute top-20 right-20 w-72 h-72 bg-rose-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//       <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

//       {/* Navigation Arrows */}
//       <button 
//         onClick={() => {
//           prevSlide();
//           setIsAutoPlaying(false);
//         }}
//         className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group"
//       >
//         <ChevronLeft className="w-6 h-6 text-slate-800 group-hover:text-rose-600 transition-colors" />
//       </button>
      
//       <button 
//         onClick={() => {
//           nextSlide();
//           setIsAutoPlaying(false);
//         }}
//         className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group"
//       >
//         <ChevronRight className="w-6 h-6 text-slate-800 group-hover:text-rose-600 transition-colors" />
//       </button>

//       {/* Slides */}
//       <div className="relative w-full h-full">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-all duration-700 ${
//               index === currentSlide 
//                 ? 'opacity-100 translate-x-0' 
//                 : index < currentSlide 
//                 ? 'opacity-0 -translate-x-full' 
//                 : 'opacity-0 translate-x-full'
//             }`}
//           >
//             <div className="container mx-auto h-full flex items-center px-8 lg:px-16">
//               <div className="grid grid-cols-1 mx-10 lg:grid-cols-[60%_40%] gap-12 items-center w-full">
//                 {/* Left Content */}
//                 <div className={`space-y-8 z-10 transition-all duration-1000 delay-300 ${
//                   index === currentSlide 
//                     ? 'opacity-100 translate-y-0' 
//                     : 'opacity-0 translate-y-10'
//                 }`}>
//                   {/* Decorative line */}
//                   <div className="flex items-center gap-4 animate-slideInLeft">
//                     <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-400"></div>
//                     <p className="text-sm uppercase tracking-[0.3em] text-rose-300 font-light">
//                       {slide.subtitle}
//                     </p>
//                   </div>
                  
//                   <h1 className="text-5xl lg:text-7xl font-serif text-white leading-tight animate-slideInLeft animation-delay-200 drop-shadow-2xl">
//                     {slide.title}
//                   </h1>
                  
//                   <p className="text-lg text-rose-100 max-w-md animate-slideInLeft animation-delay-400 leading-relaxed">
//                     {slide.description}
//                   </p>
                  
//                   <div className="flex gap-4 animate-slideInLeft animation-delay-600">
//                     <button className="group relative bg-white hover:bg-rose-50 text-slate-800 px-10 py-4 uppercase tracking-wider text-sm font-semibold transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 rounded-full overflow-hidden">
//                       <span className="relative z-10">Shop Now</span>
//                       <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     </button>
                    
//                     <button className="group bg-transparent border-2 border-white/80 hover:border-white text-white px-10 py-4 uppercase tracking-wider text-sm font-semibold transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 rounded-full backdrop-blur-sm hover:bg-white/10">
//                       View Collection
//                     </button>
//                   </div>
                  
//                   {/* Trust indicators */}
//                   <div className="flex gap-8 pt-4 animate-slideInLeft animation-delay-800">
//                     <div className="text-white/90">
//                       <div className="flex items-center gap-2 mb-1">
//                         <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
//                         </svg>
//                         <span className="font-semibold">5.0</span>
//                       </div>
//                       <p className="text-xs text-rose-200">2000+ Reviews</p>
//                     </div>
                    
//                     <div className="text-white/90 border-l border-white/30 pl-8">
//                       <div className="flex items-center gap-2 mb-1">
//                         <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         <span className="font-semibold">Certified</span>
//                       </div>
//                       <p className="text-xs text-rose-200">100% Authentic</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Indicator Dots */}
//       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`transition-all duration-300 rounded-full ${
//               index === currentSlide 
//                 ? 'bg-rose-400 w-12 h-3 shadow-lg shadow-rose-400/50' 
//                 : 'bg-white/60 hover:bg-white/90 w-3 h-3'
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       <style jsx>{`
//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         .animate-slideInLeft {
//           animation: slideInLeft 0.8s ease-out forwards;
//         }
        
//         .animation-delay-200 {
//           animation-delay: 0.2s;
//           opacity: 0;
//         }
        
//         .animation-delay-400 {
//           animation-delay: 0.4s;
//           opacity: 0;
//         }
        
//         .animation-delay-600 {
//           animation-delay: 0.6s;
//           opacity: 0;
//         }
        
//         .animation-delay-800 {
//           animation-delay: 0.8s;
//           opacity: 0;
//         }
        
//         .delay-1000 {
//           animation-delay: 1s;
//         }
//       `}</style>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function GoldEarringsHero() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   const slides = [
//     {
//       title: "Gold Earrings For Women",
//       image:
//         "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80",
//       subtitle: "Explore Jewelry Wholesale & Online Marketplace",
//     },
//     {
//       title: "Diamond Studded Collection",
//       image:
//         "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80",
//       subtitle: "Handcrafted Elegance For Every Occasion",
//     },
//     {
//       title: "Premium Gold Jewelry",
//       image:
//         "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80",
//       subtitle: "Timeless Designs That Shine Forever",
//     },
//   ];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     setIsAutoPlaying(false);
//   };

//   useEffect(() => {
//     if (!isAutoPlaying) return;
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [isAutoPlaying, slides.length]);

//   return (
//     <div className="relative w-full overflow-hidden">
//       {/* Responsive height wrapper */}
//       <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh]">
//         {/* Background base gradient (under images) */}
//         <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 z-0"></div>

//         {/* Decorative Elements (hidden on small screens) */}
//         <div className="hidden lg:block absolute top-16 right-16 w-56 h-56 bg-rose-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="hidden lg:block absolute bottom-24 left-12 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

//         {/* Slides container */}
//         <div className="relative w-full h-full">
//           {slides.map((slide, index) => {
//             const visible = index === currentSlide;
//             return (
//               <div
//                 key={index}
//                 className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
//                   visible ? "opacity-100 z-10 translate-x-0" : "opacity-0 -z-0 pointer-events-none translate-x-4"
//                 }`}
//                 style={{
//                   backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.25)), url(${slide.image})`,
//                   backgroundRepeat: "no-repeat",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//                 aria-hidden={!visible}
//               >
//                 <div className="container mx-auto h-full flex items-center px-6 md:px-10 lg:px-16">
//                   <div className="w-full grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center">
//                     <div
//                       className={`space-y-6 z-20 max-w-2xl transition-all duration-700 ${
//                         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
//                       }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400"></div>
//                         <p className="text-xs sm:text-sm uppercase tracking-wider text-rose-200 font-light">
//                           {slide.subtitle}
//                         </p>
//                       </div>

//                       <h1 className="font-serif text-white leading-tight drop-shadow-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
//                         {slide.title}
//                       </h1>

//                       <p className="text-sm sm:text-base text-rose-100 max-w-md leading-relaxed">
//                         Discover beautiful handcrafted pieces — curated for modern women who love timeless style.
//                       </p>

//                       <div className="flex flex-wrap gap-3 sm:gap-4">
//                         <button
//                           className="group relative bg-white text-slate-800 px-6 sm:px-8 py-2.5 sm:py-3 uppercase tracking-wider text-xs sm:text-sm font-semibold rounded-full transition-transform transform hover:-translate-y-1 shadow-md"
//                           onClick={() => setIsAutoPlaying(false)}
//                         >
//                           <span className="relative z-10">Shop Now</span>
//                           <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
//                         </button>

//                         <button
//                           className="bg-transparent border-2 border-white/80 text-white px-6 sm:px-8 py-2.5 sm:py-3 uppercase tracking-wider text-xs sm:text-sm font-semibold rounded-full backdrop-blur-sm hover:bg-white/10 transition"
//                           onClick={() => setIsAutoPlaying(false)}
//                         >
//                           View Collection
//                         </button>
//                       </div>

//                       <div className="flex gap-6 pt-3 text-rose-100 text-xs sm:text-sm">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <svg className="w-4 h-4 text-rose-300" fill="currentColor" viewBox="0 0 20 20">
//                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                             </svg>
//                             <span className="font-semibold text-white">5.0</span>
//                           </div>
//                           <div className="text-rose-200">2000+ Reviews</div>
//                         </div>

//                         <div className="border-l border-white/30 pl-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <svg className="w-4 h-4 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             <span className="font-semibold text-white">Certified</span>
//                           </div>
//                           <div className="text-rose-200">100% Authentic</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Right column (hidden on small screens) */}
//                     <div className="hidden lg:flex items-center justify-center">
//                       <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-white/90 max-w-xs">
//                         <p className="text-sm font-medium">Limited Edition</p>
//                         <h3 className="mt-2 text-lg font-semibold">Gold Drop Earrings</h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Navigation Arrows */}
//         <button
//           onClick={() => {
//             prevSlide();
//             setIsAutoPlaying(false);
//           }}
//           className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-3 sm:p-4 rounded-full shadow-md transition-transform hover:scale-105"
//           aria-label="Previous slide"
//         >
//           <ChevronLeft className="w-5 h-5 text-slate-800" />
//         </button>

//         <button
//           onClick={() => {
//             nextSlide();
//             setIsAutoPlaying(false);
//           }}
//           className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-3 sm:p-4 rounded-full shadow-md transition-transform hover:scale-105"
//           aria-label="Next slide"
//         >
//           <ChevronRight className="w-5 h-5 text-slate-800" />
//         </button>

//         {/* Indicator Dots */}
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`rounded-full transition-all duration-300 ${
//                 index === currentSlide ? "bg-rose-400 w-9 h-2.5 shadow-lg" : "bg-white/60 w-2.5 h-2.5 hover:bg-white/90"
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         .animate-slideInLeft {
//           animation: slideInLeft 0.8s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";

export default function GoldEarringsHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: "Gold Earrings For Women",
      image:
        "/hero1.png",
      subtitle: "Explore Jewelry Wholesale & Online Marketplace",
    },
    {
      title: "Diamond Studded Collection",
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80",
      subtitle: "Handcrafted Elegance For Every Occasion",
    },
    {
      title: "Premium Gold Jewelry",
      image:
        "/hero2.jpg",
      subtitle: "Timeless Designs That Shine Forever",
    },
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  return (
    <div className="relative w-full mt-32 lg:mt-10 overflow-hidden">
      <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh]">
        {/* Background Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 z-0"></div>

        {/* Decorative Elements */}
        <div className="hidden lg:block absolute top-16 right-16 w-56 h-56 bg-rose-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="hidden lg:block absolute bottom-24 left-12 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => {
            const visible = index === currentSlide;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                  visible
                    ? "opacity-100 z-10 translate-x-0"
                    : "opacity-0 -z-0 pointer-events-none translate-x-4"
                }`}
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.25)), url(${slide.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                }}
                aria-hidden={!visible}
              >
                <div className="container mx-auto h-full flex items-center px-6 md:px-10 lg:px-16">
                  <div className="w-full grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center">
                    <div
                      className={`space-y-6 z-20 max-w-2xl transition-all duration-700 ${
                        visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400"></div>
                        <p className="text-xs sm:text-sm uppercase tracking-wider text-rose-200 font-light">
                          {slide.subtitle}
                        </p>
                      </div>

                      <h1 className="font-serif text-white leading-tight drop-shadow-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="text-sm sm:text-base text-rose-100 max-w-md leading-relaxed">
                        Discover beautiful handcrafted pieces — curated for
                        modern women who love timeless style.
                      </p>

                     

                      {/* Ratings + Trust */}
                      <div className="flex gap-6 pt-3 text-rose-100 text-xs sm:text-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg
                              className="w-4 h-4 text-rose-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold text-white">5.0</span>
                          </div>
                          <div className="text-rose-200">2000+ Reviews</div>
                        </div>

                        <div className="border-l border-white/30 pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <svg
                              className="w-4 h-4 text-rose-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="font-semibold text-white">
                              Certified
                            </span>
                          </div>
                          <div className="text-rose-200">100% Authentic</div>
                        </div>
                      </div>
                    </div>

                    {/* Right column optional */}
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-rose-400 w-9 h-2.5 shadow-lg"
                  : "bg-white/60 w-2.5 h-2.5 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
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
      `}</style>
    </div>
  );
}
