import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Logo, LogoIcon } from './Logo';
import { SimpleModal } from './SimpleModal';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const navItems = [
    { path: '/resume', label: 'Resume' },
    { path: '/design-work', label: 'Design Work' },
    { path: '/ventures', label: 'Ventures' },
  ];

  return (
    <>
      <nav className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <Link to="/" className="group flex items-center space-x-3">
              <LogoIcon 
                size={40} 
                className="bg-gradient-to-br from-white to-gray-200 text-gray-900 shadow-lg group-hover:shadow-xl transition-all duration-200" 
              />
            <div>
              {/* Desktop: Original layout */}
              {!isMobile && (
                <>
                  <div className="text-xl text-white tracking-tight group-hover:text-gray-200 transition-colors">
                    Kevin Laronda
                  </div>
                  <div className="text-xs text-gray-300 -mt-0.5">UX + Design Strategy + Manager</div>
                </>
              )}
              
              {/* Mobile: Vertically stacked, smaller font */}
              {isMobile && (
                <div className="text-lg text-white tracking-tight group-hover:text-gray-200 transition-colors" style={{ lineHeight: '1.1' }}>
                  Kevin<br />Laronda
                </div>
              )}
            </div>
            </Link>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-wide transition-all duration-200 relative ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                  )}
                </Link>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-white/50 text-white hover:bg-white hover:text-gray-900 hover:border-white shadow-sm hover:shadow-md transition-all duration-200"
                data-contact-button
                onClick={() => {
                  console.log('Contact button clicked, opening modal...');
                  setIsContactModalOpen(true);
                }}
              >
                Contact Me
              </Button>
              </div>
            )}

            {/* Mobile Navigation - Only show on screens smaller than 1024px */}
            {isMobile && (
              <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-white/50 text-white hover:bg-white hover:text-gray-900 hover:border-white shadow-sm hover:shadow-md transition-all duration-200 mr-2"
                data-contact-button
                onClick={() => {
                  console.log('Contact button clicked, opening modal...');
                  setIsContactModalOpen(true);
                }}
              >
                Contact Me
              </Button>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2 ml-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="bg-gray-800 border-t border-gray-700">
            <div className="px-6 py-4">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg tracking-wide transition-all duration-200 relative py-2 block text-right ml-auto ${
                      location.pathname === item.path
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <SimpleModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}