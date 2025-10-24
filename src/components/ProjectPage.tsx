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

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useSupabase();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (id && projects.length > 0) {
      // Find project by url_slug instead of id
      const foundProject = projects.find(p => p.url_slug === id);
      setProject(foundProject || null);
      
      if (foundProject) {
        // Get related projects (same badgeType, different project)
        const related = projects
          .filter(p => p.badgeType === foundProject.badgeType && p.id !== foundProject.id && p.is_visible)
          .slice(0, 3);
        setRelatedProjects(related);
      }
    }
  }, [id, projects]);

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-gray-900 mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/design-work">Back to Design Work</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <SEO {...generateSEO.project(project.title, project.summary)} />
      
      {/* Force rich text styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-content ul {
            list-style-type: disc !important;
            list-style-position: outside !important;
            padding-left: 2rem !important;
            margin: 1rem 0 !important;
            display: block !important;
          }
          .rich-text-content ol {
            list-style-type: decimal !important;
            list-style-position: outside !important;
            padding-left: 2rem !important;
            margin: 1rem 0 !important;
            display: block !important;
          }
          .rich-text-content ul li {
            display: list-item !important;
            list-style-type: disc !important;
            list-style-position: outside !important;
            margin: 0.5rem 0 !important;
            padding-left: 0.25rem !important;
            margin-left: 0 !important;
            color: #6b7280 !important;
          }
          .rich-text-content ol li {
            display: list-item !important;
            list-style-type: decimal !important;
            list-style-position: outside !important;
            margin: 0.5rem 0 !important;
            padding-left: 0.25rem !important;
            margin-left: 0 !important;
            color: #6b7280 !important;
          }
          .rich-text-content li p {
            margin: 0 !important;
            display: inline !important;
          }
        `
      }} />
      {/* Back Navigation */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/design-work" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Design Work
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Badge>{project.badgeType}</Badge>
        </div>
        <h1 className="text-[32px] font-bold pb-4">{project.title}</h1>
        <div className="aspect-[16/10] overflow-hidden rounded-lg">
          <ImageWithFallback
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* STAR Content */}
      <div className="space-y-12">
        {/* Problem */}
        {project.situation && (
          <section>
            <h2 className="text-gray-900 mb-4">Problem</h2>
            <div 
              className="text-gray-500 rich-text-content" 
              style={{
                // Force list styles inline
                '--ul-style': 'disc',
                '--ol-style': 'decimal'
              }}
              dangerouslySetInnerHTML={{ __html: project.situation }} 
            />
          </section>
        )}

        {/* Objective */}
        {project.task && (
          <section>
            <h2 className="text-gray-900 mb-4">Objective</h2>
            <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: project.task }} />
          </section>
        )}

        {/* Actions */}
        {project.action && (
          <section>
            <h2 className="text-gray-900 mb-4">Actions</h2>
            <div className="text-gray-500 mb-6 rich-text-content" dangerouslySetInnerHTML={{ __html: project.action }} />
          
          {/* Process Images */}
          {project.images && project.images.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={image}
                    alt={`${project.title} process ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          </section>
        )}

        {/* Output */}
        {project.output && (
          <section>
            <h2 className="text-gray-900 mb-4">Output</h2>
            <div className="text-gray-500 mb-8 rich-text-content" dangerouslySetInnerHTML={{ __html: project.output }} />
          
            {/* Metrics Cards */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.metrics.map((metric, index) => (
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

        {/* Lessons */}
        {project.lessonsLearned && (
          <section>
            <h2 className="text-gray-900 mb-4">Lessons</h2>
            <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: project.lessonsLearned }} />
          </section>
        )}
      </div>

      {/* Related Projects */}
      <section className="mt-20 pt-12 border-t border-gray-200">
        <h2 className="text-gray-900 mb-8">Related Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProjects.map((relatedProject) => (
            <Link key={relatedProject.id} to={`/design-work/${relatedProject.url_slug}`}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={relatedProject.heroImage}
                    alt={relatedProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">{relatedProject.badgeType}</Badge>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="text-gray-900 mb-1">{relatedProject.title}</h3>
                  <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: relatedProject.summary }} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}