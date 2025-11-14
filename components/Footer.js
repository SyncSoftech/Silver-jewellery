import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-gray-600 body-font bg-white border-t border-gray-200">
      <div className="container px-5 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap">
        {/* Brand Info */}
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left mb-8 md:mb-0">
          <Link href="/">
            <div className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900 cursor-pointer">
              <Image 
                src='/LOGO.jpg' 
                width={200} 
                height={80} 
                alt='Silver Jewellery Logo'
                className="w-40 h-auto"
              />
            </div>
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Discover our exclusive collection of handcrafted silver jewelry, made with love and precision.
          </p>
         </div>

        {/* Quick Links */}
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">SHOP</h2>
            <nav className="list-none mb-10 space-y-2">
              <li><Link href="/rings"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Rings</span></Link></li>
              <li><Link href="/necklaces"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Necklaces</span></Link></li>
              <li><Link href="/earrings"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Earrings</span></Link></li>
              <li><Link href="/bracelets"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Bracelets</span></Link></li>
              </nav>
          </div>
          
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CUSTOMER SERVICE</h2>
            <nav className="list-none mb-10 space-y-2">
              <li><Link href="/contact"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Contact Us</span></Link></li>
              <li><Link href="/faq"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">FAQs</span></Link></li>
              <li><Link href="/shipping-replace"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Shipping & Replace</span></Link></li>
              <li><Link href="/orders"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Track Order</span></Link></li>
            </nav>
          </div>
          
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">POLICIES</h2>
            <nav className="list-none mb-10 space-y-2">
              <li><Link href="/privacy-policy"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/terms-and-conditions"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Terms & Conditions</span></Link></li>
              <li><Link href="/shipping-policy"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Shipping Policy</span></Link></li>
            </nav>
          </div>
          
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">ABOUT US</h2>
            <nav className="list-none mb-10 space-y-2">
              <li><Link href="/about"><span className="text-gray-600 hover:text-gray-800 cursor-pointer">Our Story</span></Link></li>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-50">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {currentYear} Silver Jewellery. All rights reserved.
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700" aria-label="Facebook">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700" aria-label="Instagram">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
