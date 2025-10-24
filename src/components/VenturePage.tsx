import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { SEO, generateSEO } from './SEO';
import type { Project } from '../lib/supabase';

export function VenturePage() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useSupabase();
  const [venture, setVenture] = useState<Project | null>(null);
  const [relatedVentures, setRelatedVentures] = useState<Project[]>([]);

  useEffect(() => {
    if (id && projects.length > 0) {
      // Find project with Ventures badge type by url_slug
      const foundVenture = projects.find(p => p.url_slug === id && p.badgeType === 'Ventures');
      setVenture(foundVenture || null);
      
      if (foundVenture) {
        // Get other ventures sorted by sort_order
        const otherVentures = projects
          .filter(p => p.badgeType === 'Ventures' && p.id !== foundVenture.id && p.is_visible)
          .sort((a, b) => a.sort_order - b.sort_order);
        
        // Find ventures closest to current venture's sort_order
        const currentIndex = otherVentures.findIndex(v => v.sort_order > foundVenture.sort_order);
        
        let related: Project[] = [];
        
        // Get ventures around the current one (before and after)
        if (currentIndex === -1) {
          // Current venture is last, show previous 3
          related = otherVentures.slice(-3);
        } else if (currentIndex === 0) {
          // Current venture is first, show next 3
          related = otherVentures.slice(0, 3);
        } else {
          // Get 1-2 before and fill rest with after
          const before = otherVentures.slice(Math.max(0, currentIndex - 1), currentIndex);
          const after = otherVentures.slice(currentIndex, currentIndex + 2);
          related = [...before, ...after].slice(0, 3);
        }
        
        setRelatedVentures(related);
      }
    }
  }, [id, projects]);

  if (!venture) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-gray-900 mb-4">Venture Not Found</h1>
        <p className="text-gray-600 mb-8">The venture you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/ventures">Back to Ventures</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <SEO {...generateSEO.project(venture.title, venture.summary)} />
      {/* Back Navigation */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/ventures" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Ventures
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Badge>{venture.badgeType}</Badge>
        </div>
        <h1 className="text-[32px] font-bold pb-4">{venture.title}</h1>
        <div className="aspect-[16/10] overflow-hidden rounded-lg">
          <ImageWithFallback
            src={venture.heroImage}
            alt={venture.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Venture Content */}
      <div className="space-y-12">
        {/* Business Details */}
        <section>
          <h2 className="text-gray-900 mb-4">Business Details</h2>
          <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: venture.businessdetails }} />
        </section>

        {/* STAR Sections with Design Work headers */}
        {venture.situation && (
          <section>
            <h2 className="text-gray-900 mb-4">Problem</h2>
            <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: venture.situation }} />
          </section>
        )}

        {venture.task && (
          <section>
            <h2 className="text-gray-900 mb-4">Objective</h2>
            <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: venture.task }} />
          </section>
        )}

        {venture.action && (
          <section>
            <h2 className="text-gray-900 mb-4">Actions</h2>
            <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: venture.action }} />
          </section>
        )}

        {venture.output && (
          <section>
            <h2 className="text-gray-900 mb-4">Output</h2>
            <div className="text-gray-500 mb-8 rich-text-content" dangerouslySetInnerHTML={{ __html: venture.output }} />
          
            {venture.metrics && venture.metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venture.metrics.map((metric, index) => (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
                    <div className="text-3xl text-gray-900 mb-2">{metric.value}</div>
                    <div className="text-sm text-gray-900 mb-2">{metric.title}</div>
                    <div className="text-xs text-gray-600 leading-relaxed">{metric.description}</div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {venture.lessonsLearned && (
          <section>
            <h2 className="text-gray-900 mb-4">Lessons</h2>
            <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: venture.lessonsLearned }} />
          </section>
        )}
      </div>

      {/* Related Ventures */}
      <section className="mt-20 pt-12 border-t border-gray-200">
        <h2 className="text-gray-900 mb-8">Related Ventures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedVentures.map((relatedVenture) => (
            <Link key={relatedVenture.id} to={`/ventures/${relatedVenture.url_slug}`}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={relatedVenture.heroImage}
                    alt={relatedVenture.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">{relatedVenture.badgeType}</Badge>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="text-gray-900 mb-1">{relatedVenture.title}</h3>
                  <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: relatedVenture.summary }} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mt-20">
        <Card className="p-16 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl text-gray-900 mb-6 tracking-tight">Let's Work Together</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your product experience? I'm available for UX strategy, design leadership, and design thinking facilitation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
                onClick={() => {
                  // Trigger the Navigation's Contact Me button
                  const contactButton = document.querySelector('[data-contact-button]') as HTMLButtonElement;
                  if (contactButton) {
                    contactButton.click();
                  }
                }}
              >
                Get In Touch
              </Button>
              <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all duration-300 px-8 py-4" asChild>
                <Link to="/resume">View Resume</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}