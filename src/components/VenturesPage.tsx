import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { SEO, generateSEO } from './SEO';
import type { Project } from '../lib/supabase';

export function VenturesPage() {
  const { projects, loading } = useSupabase();
  const [displayVentures, setDisplayVentures] = useState<Project[]>([]);

  useEffect(() => {
    // Filter projects with Ventures badge type
    const visibleVentures = projects.filter(project => 
      project.is_visible && project.badgeType === 'Ventures'
    );
    setDisplayVentures(visibleVentures.sort((a, b) => a.sort_order - b.sort_order));
  }, [projects]);
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <SEO {...generateSEO.ventures()} />
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-gray-900 mb-6">Ventures</h1>
        <p className="text-gray-600 max-w-3xl">
          Businesses I've helped or created using my UX and design thinking experience and frameworks for real-world challenges.
        </p>
      </div>

      {/* Ventures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayVentures.length > 0 ? (
          displayVentures.map((venture) => (
            <Link key={venture.id} to={`/ventures/${venture.url_slug}`}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={venture.heroImage}
                    alt={venture.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{venture.badgeType}</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{venture.title}</h3>
                  <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: venture.summary }} />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-8">No ventures available yet.</p>
        )}
      </div>
    </div>
  );
}