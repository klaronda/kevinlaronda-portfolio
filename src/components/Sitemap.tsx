import React from 'react';
import ReactMarkdown from 'react-markdown';

// Generate sitemap for SEO purposes
export const generateSitemap = (projects: any[] = [], ventures: any[] = []) => {
  const baseUrl = 'https://kevinlaronda.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/resume', priority: '0.9', changefreq: 'monthly' },
    { url: '/design-work', priority: '0.9', changefreq: 'weekly' },
    { url: '/ventures', priority: '0.8', changefreq: 'monthly' },
  ];

  const projectPages = projects
    .filter(project => project.is_visible)
    .map(project => ({
      url: `/design-work/${project.url_slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    }));

  const venturePages = ventures
    .filter(venture => venture.is_visible)
    .map(venture => ({
      url: `/ventures/${venture.url_slug}`,
      priority: '0.7',
      changefreq: 'monthly'
    }));

  const allPages = [...staticPages, ...projectPages, ...venturePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = 'https://kevinlaronda.com';
  
  return `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin
Disallow: /admin/*`;
};

// Component for displaying sitemap in a readable format (for users)
export function SitemapPage({ projects = [], ventures = [] }: { projects?: any[], ventures?: any[] }) {
  const staticPages = [
    { name: 'Home', path: '/', description: 'Homepage with portfolio overview and featured projects' },
    { name: 'Resume', path: '/resume', description: 'Professional experience and work history' },
    { name: 'Design Work', path: '/design-work', description: 'UX design projects and case studies' },
    { name: 'Ventures', path: '/ventures', description: 'Business ventures and entrepreneurial projects' },
  ];

  const visibleProjects = projects.filter(project => project.is_visible);
  const visibleVentures = ventures.filter(venture => venture.is_visible);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-gray-900 mb-8">Site Map</h1>
      
      <div className="space-y-8">
        {/* Main Pages */}
        <section>
          <h2 className="text-xl text-gray-900 mb-4">Main Pages</h2>
          <div className="space-y-2">
            {staticPages.map(page => (
              <div key={page.path} className="border-b border-gray-200 pb-2">
                <a 
                  href={page.path}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {page.name}
                </a>
                <p className="text-gray-600 text-sm">{page.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Project Pages */}
        <section>
          <h2 className="text-xl text-gray-900 mb-4">Design Projects</h2>
          {visibleProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleProjects.map(project => (
                <div key={project.id} className="border border-gray-200 p-4 rounded-lg">
                  <a 
                    href={`/design-work/${project.url_slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium block mb-2"
                  >
                    {project.title}
                  </a>
                  <div className="text-gray-600 text-sm">
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
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No design projects available yet.</p>
          )}
        </section>

        {/* Venture Pages */}
        <section>
          <h2 className="text-xl text-gray-900 mb-4">Business Ventures</h2>
          {visibleVentures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleVentures.map(venture => (
                <div key={venture.id} className="border border-gray-200 p-4 rounded-lg">
                  <a 
                    href={`/ventures/${venture.url_slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium block mb-2"
                  >
                    {venture.title}
                  </a>
                  <p className="text-gray-600 text-sm">{venture.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No business ventures available yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}