import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { SEO, generateSEO } from './SEO';
import type { Project } from '../lib/supabase';

export function DesignWorkPage() {
  const { projects, loading } = useSupabase();
  const [uxDesignProjects, setUxDesignProjects] = useState<Project[]>([]);
  const [uxStrategyProjects, setUxStrategyProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Only use Supabase projects - combine UX Design and UX Strategy
    const visibleProjects = projects.filter(project => 
      project.is_visible && (project.badgeType === 'UX Design' || project.badgeType === 'UX Strategy')
    );
    setUxDesignProjects(visibleProjects); // Store all UX projects together
    setUxStrategyProjects([]); // No longer needed as separate section
  }, [projects]);

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

      {/* All UX Work (Design & Strategy) */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uxDesignProjects.length > 0 ? (
            uxDesignProjects
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((project) => (
                <Link key={project.id} to={`/design-work/${project.url_slug}`}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">{project.badgeType}</Badge>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <h3 className="text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: project.summary }} />
                    </div>
                  </Card>
                </Link>
              ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-8">No projects available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}