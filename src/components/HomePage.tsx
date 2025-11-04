import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Users, Target, Lightbulb } from 'lucide-react';
import { SEO, generateSEO } from './SEO';
import { useSupabase } from '../hooks/useSupabase';
import { MarkdownRenderer } from './MarkdownRenderer';


const designThinkingBenefits = [
  {
    icon: Users,
    title: 'Cross-Functional Alignment',
    description: 'Unite diverse teams around shared understanding and common goals through structured collaboration.'
  },
  {
    icon: Target,
    title: 'Strategic Clarity',
    description: 'Transform ambiguous challenges into clear, actionable opportunities with defined success metrics.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation Catalyst',
    description: 'Generate breakthrough solutions through systematic ideation and rapid prototyping methods.'
  }
];

export function HomePage() {
  const { projects, loading: projectsLoading } = useSupabase();
  
  // Filter and sort featured projects
  const featuredProjects = projects
    .filter(p => p.show_on_homepage && p.is_visible)
    .sort((a, b) => (a.homepage_display_order || 999) - (b.homepage_display_order || 999))
    .slice(0, 8);
  
  return (
    <div>
      <SEO {...generateSEO.home()} />
      {/* Hero Section with Background */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://ncefkmwkjyidchoprhth.supabase.co/storage/v1/object/public/site_images/hero.jpeg"
            alt="Kevin Laronda UX Designer"
            className="w-full h-full object-cover object-center"
            width={1200}
            height={800}
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-gray-200/50 shadow-sm mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Available for new opportunities
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 tracking-tight">
              Strategic UX
              <span className="block text-gray-600">Design Leader</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
              I design and lead with strategy—helping teams solve complex problems and create experiences customers love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  // Trigger the Navigation's Contact Me button
                  const contactButton = document.querySelector('[data-contact-button]') as HTMLButtonElement;
                  if (contactButton) {
                    contactButton.click();
                  }
                }}
              >
                Contact for Work
              </Button>
              <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all duration-300" asChild>
                <Link to="/design-work">View My Work</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      <div className="space-y-12 bg-white">

        {/* Highlight Projects */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl text-gray-900 mb-6 tracking-tight">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A selection of recent work spanning UX design, strategy, and innovation across fintech, healthcare, and enterprise solutions.
            </p>
          </div>

          {featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No featured projects yet. Select projects in the Admin panel to showcase them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => {
                const projectUrl = project.badgeType === 'Ventures' 
                  ? `/ventures/${project.url_slug}` 
                  : `/design-work/${project.url_slug}`;
                
                return (
                  <Link key={project.id} to={projectUrl}>
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                      <div className="aspect-[4/3] overflow-hidden">
                        <ImageWithFallback
                          src={project.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 card-image"
                          width={400}
                          height={300}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="shadow-sm">{project.badgeType}</Badge>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        <h3 className="text-xl text-gray-900 mb-3">{project.title}</h3>
                        <MarkdownRenderer 
                          content={project.summary}
                          className="text-gray-600 leading-relaxed"
                        />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Design Thinking Facilitation */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl text-gray-900 mb-6 tracking-tight">Design Thinking Facilitation</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                I facilitate strategic workshops using the Double Diamond methodology: <strong>Discover → Define → Develop → Deliver</strong>. 
                These sessions create alignment, generate insights, and produce actionable deliverables that drive product success.
              </p>
              <div className="flex justify-center">
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1562939651-9359f291c988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB0aGlua2luZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc1OTc1NDA0OHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Design thinking workshop"
                    className="rounded-xl shadow-2xl max-w-lg w-full"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {designThinkingBenefits.map((benefit, index) => (
                <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl mb-6 shadow-sm">
                    <benefit.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-4 text-left">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-left">{benefit.description}</p>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
                <p className="text-gray-700 text-lg">
                  Workshop outputs include stakeholder mapping, personas, journey maps, storyboarding, and PRD or Press Release documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Module */}
        <section id="contact" className="max-w-6xl mx-auto px-6 py-12 mb-4">
          <Card className="p-16 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl text-gray-900 mb-6 tracking-tight">Let's Work Together</h2>
              <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Ready to transform your product experience? I'm available for UX strategy, design leadership, and design thinking facilitation.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
                  onClick={() => {
                    // Trigger the Navigation's Contact Me button
                    const contactButton = document.querySelector('[data-contact-button]') as HTMLButtonElement;
                    if (contactButton) {
                      contactButton.click();
                    }
                  }}
                >
                  Get In Touch
                </Button>
                <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all duration-300 px-8 py-4" asChild>
                  <Link to="/resume">View Resume</Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}