import React, { useEffect, useState, useRef } from 'react';
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
  const { projects, projectsLoading } = useSupabase();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for data to be loaded
    if (projectsLoading) {
      return;
    }

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
  }, [id, projects, projectsLoading]);

  // Lightbox state and functions
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  // Debug lightbox state changes
  useEffect(() => {
    console.log('Lightbox state changed:', lightboxImage);
  }, [lightboxImage]);

  const openLightbox = React.useCallback((src: string, alt: string) => {
    console.log('openLightbox called with:', src, alt);
    setLightboxImage({ src, alt });
  }, []);

  const closeLightbox = React.useCallback(() => {
    setLightboxImage(null);
  }, []);

  // Handle Escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage, closeLightbox]);

  // Process images in rich text content to add lightbox functionality
  useEffect(() => {
    if (!project || !contentRef.current) return;

    const processImages = () => {
      const richTextContents = contentRef.current?.querySelectorAll('.rich-text-content');
      console.log('Found rich text containers:', richTextContents?.length || 0);
      richTextContents?.forEach((container) => {
        const images = container.querySelectorAll('img:not(.image-lightbox-processed)');
        console.log('Found images in container:', images.length);
        images.forEach((img) => {
          // Mark as processed
          img.classList.add('image-lightbox-processed');
          
          const src = img.getAttribute('src') || '';
          const alt = img.getAttribute('alt') || '';
          
          // Skip if no src
          if (!src) return;
          
          // Create wrapper
          const wrapper = document.createElement('div');
          wrapper.className = 'image-lightbox-wrapper';
          wrapper.style.cssText = 'position: relative; display: inline-block; max-width: 100%; width: 100%;';
          
          // Wrap the image
          const parent = img.parentNode;
          if (parent) {
            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            // Make image responsive
            img.style.cssText = 'max-width: 100%; height: auto; display: block;';
            
            // Add expand button
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'image-expand-button';
            button.style.cssText = 'position: absolute; top: 8px; right: 8px; background: rgba(0, 0, 0, 0.7); color: white; padding: 8px; border-radius: 9999px; opacity: 0; transition: opacity 0.2s; z-index: 10; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center;';
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
            button.setAttribute('aria-label', 'Expand image');
            
            // Show button on hover
            wrapper.addEventListener('mouseenter', () => {
              button.style.opacity = '1';
            });
            wrapper.addEventListener('mouseleave', () => {
              button.style.opacity = '0';
            });
            
            button.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Opening lightbox with:', src, alt);
              openLightbox(src, alt);
            });
            
            wrapper.appendChild(button);
            console.log('Added lightbox button to image:', src);
          }
        });
      });
    };

    // Process after a delay to ensure DOM is ready, and also on content changes
    const timer = setTimeout(() => {
      console.log('Processing images for lightbox...');
      processImages();
      // Also try again after a bit more delay in case content loads slowly
      setTimeout(processImages, 500);
    }, 300);
    return () => clearTimeout(timer);
  }, [project, openLightbox]);

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

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
    <div className="max-w-4xl mx-auto px-6 py-16" ref={contentRef}>
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
            className="w-full h-full object-cover project-page-image"
          />
        </div>
      </div>

      {/* Overview */}
      {project.overview && (
        <section className="mb-12">
          <div className="text-gray-500 rich-text-content" dangerouslySetInnerHTML={{ __html: project.overview }} />
        </section>
      )}

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
                <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg relative group">
                  <ImageWithFallback
                    src={image}
                    alt={`${project.title} process ${index + 1}`}
                    className="w-full h-full object-cover project-page-image"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Opening lightbox for process image:', image);
                      openLightbox(image, `${project.title} process ${index + 1}`);
                    }}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                    aria-label="Expand image"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                  </button>
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 card-image"
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

      {/* Global Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-200 z-10 cursor-pointer"
            aria-label="Close image"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
          <div 
            className="relative max-w-[90vw] max-h-[90vh] animate-scale-in" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          >
            <ImageWithFallback
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}