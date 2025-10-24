import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEO({
  title = 'Kevin Laronda - UX Design Strategist & Design Thinking Leader',
  description = 'Kevin Laronda is a UX Design Strategist and former Design Manager with 12+ years creating user-centered digital experiences. Specializing in strategic design thinking, UX leadership, and design facilitation.',
  keywords = 'UX Designer, Design Strategist, Design Thinking, User Experience, Product Design, Design Leadership, UX Research, Design Facilitation, San Francisco, Design Manager',
  image = 'https://images.unsplash.com/photo-1744901581831-3ffe7d3d05f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMFVYJTIwZGVzaWduZXJ8ZW58MXx8fHwxNzU5NzY2Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1200',
  url = 'https://kevinlaronda.com',
  type = 'website',
  author = 'Kevin Laronda',
  publishedTime,
  modifiedTime
}: SEOProps) {
  const fullTitle = title.includes('Kevin Laronda') ? title : `${title} | Kevin Laronda`;
  const currentUrl = typeof window !== 'undefined' ? `${url}${window.location.pathname}` : url;

  // Structured Data for Person/Professional
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kevin Laronda",
    "jobTitle": "UX Design Strategist",
    "description": description,
    "url": url,
    "image": image,
    "sameAs": [
      "https://linkedin.com/in/kevinlaronda",
      "https://github.com/kevinlaronda"
    ],
    "email": "kevin@kevinlaronda.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco Bay Area",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "Design Education Institution"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance UX Design Strategist"
    },
    "knowsAbout": [
      "User Experience Design",
      "Design Strategy",
      "Design Thinking",
      "Product Design",
      "User Research",
      "Design Leadership",
      "Design Systems"
    ]
  };

  // Website structured data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kevin Laronda - UX Design Portfolio",
    "url": url,
    "description": description,
    "author": {
      "@type": "Person",
      "name": "Kevin Laronda"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/design-work?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    
    // Open Graph meta tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:site_name', 'Kevin Laronda Portfolio', true);
    
    // Twitter meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Add structured data
    let structuredDataScript = document.querySelector('#structured-data');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Add website structured data
    let websiteDataScript = document.querySelector('#website-data');
    if (!websiteDataScript) {
      websiteDataScript = document.createElement('script');
      websiteDataScript.id = 'website-data';
      websiteDataScript.type = 'application/ld+json';
      document.head.appendChild(websiteDataScript);
    }
    websiteDataScript.textContent = JSON.stringify(websiteData);

  }, [fullTitle, description, keywords, author, type, image, currentUrl, structuredData, websiteData]);

  return null;
}

// Helper function to generate page-specific SEO props
export const generateSEO = {
  home: () => ({
    title: 'Kevin Laronda - UX Design Strategist & Design Thinking Leader',
    description: 'Kevin Laronda is a UX Design Strategist with 12+ years creating user-centered digital experiences. Available for UX strategy, design leadership, and design thinking facilitation.',
    keywords: 'UX Designer, Design Strategist, Design Thinking, User Experience, Product Design, Design Leadership, UX Research, Design Facilitation, San Francisco'
  }),
  
  resume: () => ({
    title: 'Resume - Kevin Laronda UX Design Strategist',
    description: 'Kevin Laronda\'s professional resume showcasing 12+ years of UX design experience, design leadership roles, and expertise in design thinking facilitation.',
    keywords: 'Kevin Laronda Resume, UX Designer Resume, Design Manager Experience, UX Strategy, Design Leadership'
  }),
  
  designWork: () => ({
    title: 'Design Work & Case Studies - Kevin Laronda',
    description: 'Explore Kevin Laronda\'s UX design portfolio featuring case studies in fintech, healthcare, and enterprise solutions. See STAR-format project breakdowns.',
    keywords: 'UX Portfolio, Design Case Studies, Product Design Projects, UX Research, Design Strategy Projects'
  }),
  
  ventures: () => ({
    title: 'Business Ventures - Kevin Laronda',
    description: 'Kevin Laronda\'s entrepreneurial ventures and business projects, showcasing design thinking applied to business strategy and product development.',
    keywords: 'Design Entrepreneur, Business Ventures, Design Strategy, Product Development, Design Thinking Business'
  }),
  
  project: (projectTitle: string, projectDescription: string) => ({
    title: `${projectTitle} - Case Study | Kevin Laronda`,
    description: projectDescription,
    type: 'article' as const,
    keywords: 'UX Case Study, Design Process, User Research, Product Design, Design Strategy'
  })
};