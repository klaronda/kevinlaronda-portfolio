import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { SEO, generateSEO } from './SEO';
import type { Project, Series, Venture } from '../lib/supabase';
import { MarkdownRenderer } from './MarkdownRenderer';

export function VenturesPage() {
  const { projects, ventures, series, loading } = useSupabase();
  const [displayItems, setDisplayItems] = useState<(Project | Series | Venture)[]>([]);

  useEffect(() => {
    // Wait for data to be loaded
    if (loading) {
      return;
    }

    // Filter out projects that belong to series (they'll be shown as series cards)
    const standaloneProjects = projects.filter(project => 
      project.is_visible && 
      project.badgeType === 'Ventures' &&
      !project.series_id
    );

    // Get standalone ventures (from ventures table)
    const standaloneVentures = ventures.filter(venture => 
      venture.is_visible
    );

    // Get series for Ventures
    const venturesSeries = series.filter(s => 
      s.is_visible && s.badge_type === 'Ventures'
    );

    // Combine standalone projects, ventures, and series, sort by sort_order
    const combined = [...standaloneProjects, ...standaloneVentures, ...venturesSeries]
      .sort((a, b) => a.sort_order - b.sort_order);

    setDisplayItems(combined);
  }, [projects, ventures, series, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ventures...</p>
        </div>
      </div>
    );
  }

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

      {/* Ventures Grid + Series */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayItems.length > 0 ? (
          displayItems.map((item) => {
            // Check if item is a series, project, or venture
            const isSeries = 'badge_type' in item;
            const isVenture = 'status' in item; // Ventures have a 'status' field
            
            if (isSeries) {
              // Render series card
              const series = item as Series;
              return (
                <Link key={series.id} to={`/ventures/${series.url_slug}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="card-image-shell aspect-[4/3]">
                      <ImageWithFallback
                        src={series.image_url}
                        alt={series.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 card-image"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">Series</Badge>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <h3 className="text-gray-900 mb-2">{series.title}</h3>
                      <p className="text-gray-600">{series.description}</p>
                    </div>
                  </Card>
                </Link>
              );
            } else if (isVenture) {
              // Render venture card (from ventures table)
              const venture = item as Venture;
              return (
                <Link key={venture.id} to={`/ventures/${venture.url_slug}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="card-image-shell aspect-[16/10]">
                      <ImageWithFallback
                        src={venture.image}
                        alt={venture.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 card-image"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">Venture</Badge>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <h3 className="text-gray-900 mb-2">{venture.title}</h3>
                      <p className="text-gray-600">{venture.description}</p>
                    </div>
                  </Card>
                </Link>
              );
            } else {
              // Render project card (from projects table with Ventures badgeType)
              const project = item as Project;
              return (
                <Link key={project.id} to={`/ventures/${project.url_slug}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="card-image-shell aspect-[16/10]">
                      <ImageWithFallback
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 card-image"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">{project.badgeType}</Badge>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <h3 className="text-gray-900 mb-2">{project.title}</h3>
                      <MarkdownRenderer 
                        content={project.summary}
                        className="text-gray-600"
                      />
                    </div>
                  </Card>
                </Link>
              );
            }
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center py-8">No ventures available yet.</p>
        )}
      </div>
    </div>
  );
}