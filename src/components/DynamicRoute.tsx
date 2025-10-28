import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectPage } from './ProjectPage';
import { VenturePage } from './VenturePage';
import { SeriesPage } from './SeriesPage';
import { useSupabase } from '../hooks/useSupabase';

interface DynamicRouteProps {
  type: 'design-work' | 'ventures';
}

export function DynamicRoute({ type }: DynamicRouteProps) {
  const { id } = useParams<{ id: string }>();
  const { projects, ventures, series, projectsLoading, venturesLoading, seriesLoading } = useSupabase();
  const [routeType, setRouteType] = useState<'series' | 'project' | 'loading' | 'not-found'>('loading');

  useEffect(() => {
    const determineRoute = () => {
      if (!id) {
        setRouteType('not-found');
        return;
      }

      // Wait for data to be loaded before checking
      if (projectsLoading || venturesLoading || seriesLoading) {
        return;
      }

      try {
        // First check if it's a series using loaded data
        const foundSeries = series.find(s => s.url_slug === id && s.badge_type === (type === 'design-work' ? 'Design Work' : 'Ventures'));
        if (foundSeries) {
          setRouteType('series');
          return;
        }

        // Then check if it's a project/venture using loaded data
        if (type === 'design-work') {
          const foundProject = projects.find(p => p.url_slug === id);
          if (foundProject) {
            setRouteType('project');
            return;
          }
        } else {
          // For ventures, check both ventures table and projects table using loaded data
          const foundVenture = ventures.find(v => v.url_slug === id);
          if (foundVenture) {
            setRouteType('project');
            return;
          }
          
          // Also check projects table for ventures using loaded data
          const foundProject = projects.find(p => p.url_slug === id && p.badgeType === 'Ventures');
          if (foundProject) {
            setRouteType('project');
            return;
          }
        }

        // Not found
        setRouteType('not-found');
      } catch (error) {
        console.error('DynamicRoute: Error determining route:', error);
        setRouteType('not-found');
      }
    };

    determineRoute();
  }, [id, type, projectsLoading, venturesLoading, seriesLoading, projects, ventures, series]);

  if (routeType === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (routeType === 'not-found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (routeType === 'series') {
    return <SeriesPage />;
  }

  // routeType === 'project'
  if (type === 'design-work') {
    return <ProjectPage />;
  } else {
    return <VenturePage />;
  }
}



