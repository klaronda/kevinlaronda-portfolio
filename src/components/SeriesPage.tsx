import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';
import { SEO } from './SEO';
import { getProjectsBySeries } from '../lib/database';
import { useSupabase } from '../hooks/useSupabase';
import type { Series, Project } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';

export function SeriesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { series: allSeries, seriesLoading } = useSupabase();
  const [series, setSeries] = useState<Series | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeriesData = async () => {
      if (!id) {
        setError('Series not found');
        setLoading(false);
        return;
      }

      // Wait for series data to be loaded
      if (seriesLoading) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Find series in loaded data
        const seriesData = allSeries.find(s => s.url_slug === id);
        if (!seriesData) {
          setError('Series not found');
          setLoading(false);
          return;
        }

        setSeries(seriesData);

        // Fetch projects in this series
        const projectsData = await getProjectsBySeries(seriesData.id);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching series data:', err);
        setError('Failed to load series');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [id, seriesLoading, allSeries]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading series...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Series Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The series you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const backPath = series.badge_type === 'Design Work' ? '/design-work' : '/ventures';

  return (
    <>
      <SEO 
        title={`${series.title} - Kevin Laronda`}
        description={series.description}
        keywords={`${series.title}, UX Design, Case Study, Kevin Laronda`}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              to={backPath}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {series.badge_type === 'Design Work' ? 'Design Work' : 'Ventures'}
            </Link>
          </div>

          {/* Series Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                Series
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                {series.badge_type}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{series.title}</h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
              {series.description}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {projects.length === 1 ? 'Case Study' : `Case Studies (${projects.length})`}
            </h2>
            
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} to={`/${series.badge_type === 'Design Work' ? 'design-work' : 'ventures'}/${project.url_slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-[16/10] overflow-hidden">
                        <ImageWithFallback
                          src={project.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 card-image"
                          width={400}
                          height={250}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {project.badgeType}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <div className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          <ReactMarkdown 
                            components={{
                              p: ({children}) => <p className="mb-1">{children}</p>,
                              strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                              em: ({children}) => <em className="italic">{children}</em>,
                            }}
                          >
                            {project.summary}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No case studies available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
