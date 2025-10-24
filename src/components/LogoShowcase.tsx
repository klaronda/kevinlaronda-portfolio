import React from 'react';
import { Logo, LogoMinimal, LogoIcon, LogoIconDark } from './Logo';
import { Card } from './ui/card';

export function LogoShowcase() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-gray-900 mb-8">Kevin Laronda Brand Logo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Main Logo */}
        <Card className="p-8 text-center">
          <h3 className="text-lg text-gray-900 mb-6">Main Logo</h3>
          <div className="flex justify-center mb-6">
            <Logo size={80} />
          </div>
          <p className="text-sm text-gray-600">
            Heart with arrow symbolizing human-centered design with strategic direction.
          </p>
        </Card>

        {/* Icon with Background */}
        <Card className="p-8 text-center">
          <h3 className="text-lg text-gray-900 mb-6">Icon Version</h3>
          <div className="flex justify-center mb-6">
            <LogoIcon size={64} />
          </div>
          <p className="text-sm text-gray-600">
            Contained version with background. Perfect for navigation and app icons.
          </p>
        </Card>

        {/* Dark Version */}
        <Card className="p-8 text-center">
          <h3 className="text-lg text-gray-900 mb-6">Dark Background</h3>
          <div className="flex justify-center mb-6">
            <LogoIconDark size={64} />
          </div>
          <p className="text-sm text-gray-600">
            Inverted version for dark backgrounds and contrast.
          </p>
        </Card>

        {/* Size Variations */}
        <Card className="p-8 lg:col-span-3">
          <h3 className="text-lg text-gray-900 mb-6 text-center">Size Variations</h3>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <LogoIcon size={24} />
              <p className="text-xs text-gray-500 mt-2">24px</p>
            </div>
            <div className="text-center">
              <LogoIcon size={32} />
              <p className="text-xs text-gray-500 mt-2">32px</p>
            </div>
            <div className="text-center">
              <LogoIcon size={48} />
              <p className="text-xs text-gray-500 mt-2">48px</p>
            </div>
            <div className="text-center">
              <LogoIcon size={64} />
              <p className="text-xs text-gray-500 mt-2">64px</p>
            </div>
          </div>
        </Card>

        {/* Color Variations */}
        <Card className="p-8 lg:col-span-3">
          <h3 className="text-lg text-gray-900 mb-6 text-center">Color & Background Variations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Light backgrounds */}
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border mb-2">
                <Logo size={48} />
              </div>
              <p className="text-xs text-gray-500">On White</p>
            </div>

            <div className="text-center">
              <div className="bg-gray-50 p-4 rounded-lg mb-2">
                <Logo size={48} />
              </div>
              <p className="text-xs text-gray-500">On Light Gray</p>
            </div>

            {/* Dark backgrounds */}
            <div className="text-center">
              <div className="bg-gray-900 p-4 rounded-lg mb-2">
                <Logo size={48} className="filter invert" />
              </div>
              <p className="text-xs text-gray-500">On Dark</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg mb-2">
                <Logo size={48} className="filter invert" />
              </div>
              <p className="text-xs text-gray-500">On Gradient</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Brand Meaning */}
      <Card className="p-8 mt-8">
        <h3 className="text-lg text-gray-900 mb-4">Brand Symbolism</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base text-gray-900 mb-2">❤️ Heart Symbol</h4>
            <p className="text-sm text-gray-600">
              Represents human-centered design, empathy, and the emotional connection 
              between users and digital experiences.
            </p>
          </div>
          <div>
            <h4 className="text-base text-gray-900 mb-2">➡️ Arrow Element</h4>
            <p className="text-sm text-gray-600">
              Symbolizes direction, progress, and strategic thinking - the forward momentum 
              that great UX design creates for businesses and users.
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 italic">
            "The perfect synthesis of heart and direction - 
            where human empathy guides strategic design decisions to create meaningful user experiences."
          </p>
        </div>
      </Card>
    </div>
  );
}