import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { SEO, generateSEO } from './SEO';
import type { Project, Series } from '../lib/supabase';
import { MarkdownRenderer } from './MarkdownRenderer';

export function DesignWorkPage() {
  const { projects, series, loading } = useSupabase();
  const [displayItems, setDisplayItems] = useState<(Project | Series)[]>([]);

  useEffect(() => {
    // Wait for data to be loaded
    if (loading) {
      return;
    }

    // Filter out projects that belong to series (they'll be shown as series cards)
    const standaloneProjects = projects.filter(project => 
      project.is_visible && 
      (project.badgeType === 'UX Design' || project.badgeType === 'UX Strategy' || project.badgeType === 'Manager') &&
      !project.series_id
    );

    // Get series for Design Work
    const designWorkSeries = series.filter(s => 
      s.is_visible && s.badge_type === 'Design Work'
    );

    // Combine standalone projects and series, sort by sort_order
    const combined = [...standaloneProjects, ...designWorkSeries]
      .sort((a, b) => a.sort_order - b.sort_order);

    setDisplayItems(combined);
  }, [projects, series, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading design work...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <SEO {...generateSEO.designWork()} />
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-gray-900 mb-6">Design Work</h1>
        <p className="text-gray-600 max-w-3xl">
          A collection of user experience projects spanning strategy, research, and interface design. 
          Each project showcases systematic problem-solving, user-centered design, and measurable business impact.
        </p>
      </div>

      {/* All UX Work (Design & Strategy) + Series */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.length > 0 ? (
            displayItems.map((item) => {
              // Check if item is a series or project
              const isSeries = 'badge_type' in item;
              
              if (isSeries) {
                // Render series card
                const series = item as Series;
                return (
                  <Link key={series.id} to={`/design-work/${series.url_slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[4/3] overflow-hidden">
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
              } else {
                // Render project card
                const project = item as Project;
                return (
                  <Link key={project.id} to={`/design-work/${project.url_slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[4/3] overflow-hidden">
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
            <p className="text-gray-500 col-span-full text-center py-8">No projects available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}