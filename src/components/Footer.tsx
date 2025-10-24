import React, { useState } from 'react';
import { SimpleModal } from './SimpleModal';
import KevinSIG from '../assets/KevinSIG.svg';

export function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Kevin Laronda</h3>
          <p className="text-gray-400">
            UX Design Strategist creating meaningful digital experiences through strategic design thinking and evidence-based solutions.
          </p>
          
          {/* Badges - All on one line */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              UX Design
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Design Strategy
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Content Strategy
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Design Thinking
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Design Operations
            </span>
          </div>
          
          <div className="flex space-x-6">
            <a
              href="https://linkedin.com/in/kevinlaronda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Connect with Kevin on LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/hollaronda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow Kevin on Instagram"
            >
              Instagram
            </a>
          </div>
          <div className="mt-2" style={{ paddingTop: '8px' }}>
            <img 
              src={KevinSIG} 
              alt="Kevin Laronda Signature" 
              className="h-10 w-auto"
              style={{ 
                filter: 'brightness(0) invert(1)',
                transform: 'rotate(8deg)'
              }}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="text-left">
            <p className="text-gray-400 text-sm">
              © 2025 Kevin Laronda. All rights reserved. UX Design Strategist & Design Thinking Consultant
            </p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <SimpleModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </footer>
  );
}