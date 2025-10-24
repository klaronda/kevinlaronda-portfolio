import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSupabase } from '../hooks/useSupabase';
import { SEO, generateSEO } from './SEO';
import type { Experience, Education, Profile } from '../lib/supabase';

// Helper function to format date ranges
function formatDateRange(exp: Experience): string {
  const startDate = new Date(exp.start_date).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
  
  if (exp.end_date) {
    const endDate = new Date(exp.end_date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    return `${startDate} - ${endDate}`;
  } else {
    return `${startDate} - Present`;
  }
}

export function ResumePage() {
  const { profile, experience, education, loading } = useSupabase();
  
  // Use database data or fallback to hardcoded
  const currentProfile = profile?.[0] || { 
    name: 'Kevin Laronda', 
    title: 'UX + Design Strategy + Manager', 
    bio: '<p>I\'m a strategic problem-solver who turns messy, ambiguous challenges into clear, meaningful experiences. With roots in creative marketing and a background in skateboarding, I\'ve learned to see unconventional paths and execute with precision.</p><p>Over the years, I\'ve evolved from creative director to UX strategist, developing a knack for identifying broken experiences and redesigning them into solutions customers love. I thrive in uncertainty, prefering projects others avoid, and I move fast—often arriving with prototypes instead of just problems.</p><p>Whether leading teams or working hands-on, my focus stays the same: transforming frustration into satisfaction through thoughtful, high-impact design.</p>', 
    photo_url: 'https://ncefkmwkjyidchoprhth.supabase.co/storage/v1/object/public/site_images/resume/profile/1761162128216.jpeg' 
  };
  
  // Sort experience and education by date
  const sortedExperience = experience?.sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  ) || [];
  
  const sortedEducation = education?.sort((a, b) => 
    new Date(b.year).getTime() - new Date(a.year).getTime()
  ) || [];

  // Debug logging
  console.log('ResumePage - Profile:', profile);
  console.log('ResumePage - Experience:', experience);
  console.log('ResumePage - Education:', education);
  console.log('ResumePage - Loading:', loading);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <SEO {...generateSEO.resume()} />
      
      {/* Header with Photo */}
      <div className="mb-12">
        {currentProfile.photo_url && (
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
            <ImageWithFallback
              src={currentProfile.photo_url}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 mb-2">{currentProfile.name}</h1>
          <h2 className="text-xl text-gray-600 mb-6">{currentProfile.title}</h2>
          {currentProfile.bio && (
            <div className="text-gray-500 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: currentProfile.bio }} />
          )}
        </div>
      </div>

      {/* Experience Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Professional Experience</h2>
        <div className="space-y-8">
          {sortedExperience.length > 0 ? (
            sortedExperience.map((exp) => (
              <Card key={exp.id} className="p-8 border-0 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  {exp.logo_url && (
                    <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                      <ImageWithFallback
                        src={exp.logo_url}
                        alt={`${exp.company} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-lg text-gray-700">{exp.company}</p>
                        <p className="text-gray-600">{exp.location}</p>
                      </div>
                      <div className="text-gray-500 font-medium">
                        {formatDateRange(exp)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                    
                    {/* Key Achievements */}
                    {exp.achievements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                              <span className="text-gray-400 mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No experience entries available yet.</p>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Education & Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedEducation.length > 0 ? (
            sortedEducation.map((edu) => (
              <Card key={edu.id} className="p-6 border-0 shadow-sm">
                <div className="flex gap-4">
                  {/* Logo */}
                  {edu.logo_url && (
                    <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                      <ImageWithFallback
                        src={edu.logo_url}
                        alt={`${edu.institution} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{edu.title}</h3>
                    <p className="text-gray-700 mb-1">{edu.institution}</p>
                    <p className="text-gray-500 text-sm mb-2">{edu.year}</p>
                    {edu.emphasis && (
                      <p className="text-gray-600 text-sm">{edu.emphasis}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8 col-span-full">No education entries available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}