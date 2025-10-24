import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, Save, Plus, Edit, Trash2, Eye, AlertCircle, Minus, LogOut, User } from 'lucide-react';
// Removed mock data import - using only Supabase data
import { useProjects, useVentures, useResume } from '../hooks/useSupabase';
import { ResumeAdmin } from './ResumeAdmin';
import { supabase, Project } from '../lib/supabase';
import { RichTextEditor } from './RichTextEditor';

export function AdminPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');

  // Supabase hooks
  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError, 
    addProject, 
    editProject, 
    removeProject 
  } = useProjects();
  
  const { 
    ventures, 
    loading: venturesLoading, 
    error: venturesError, 
    addVenture, 
    editVenture, 
    removeVenture 
  } = useVentures();
  
  const { 
    resume, 
    loading: resumeLoading, 
    error: resumeError, 
    updateResume 
  } = useResume();

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    };
    getUser();
  }, []);


  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Local state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSupabaseWarning, setShowSupabaseWarning] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set active project when projects load
  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject]);

  // Helper function to strip HTML and check if content is empty
  const isContentEmpty = (htmlContent: string) => {
    if (!htmlContent) return true;
    // Remove HTML tags and check if there's meaningful content
    const textContent = htmlContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, '') // Remove non-breaking spaces
      .replace(/\s+/g, '') // Remove all whitespace
      .trim();
    return textContent === '';
  };

  // Validation function - relaxed for migration compatibility
  const validateProject = (project: any) => {
    const errors: {[key: string]: string} = {};
    
    // Only validate essential fields for migration compatibility
    if (!project.title || project.title.trim() === '') {
      errors.title = 'Title is required';
    }
    
    if (!project.url_slug || project.url_slug.trim() === '') {
      errors.url_slug = 'URL slug is required';
    }
    
    // All other fields are optional to support migration from Squarespace
    
    return errors;
  };

  const handleSave = async () => {
    if (!activeProject) return;
    
    // Clear any previous validation errors
    setValidationErrors({});
    
    try {
      // Check if this is a new project (ID starts with 'new-')
      if (activeProject.id.startsWith('new-')) {
        // Create new project
        const { id, createdAt, updatedAt, ...projectData } = activeProject;
        console.log('Creating project with data:', projectData);
        const newProject = await addProject(projectData);
        console.log('Created project:', newProject);
        if (newProject) {
          setActiveProject(newProject);
          setIsEditing(false);
          setValidationErrors({});
          alert('New project created successfully!');
        }
      } else {
        // Update existing project
        const updatedProject = await editProject(activeProject.id, activeProject);
        if (updatedProject) {
          setActiveProject(updatedProject);
          setIsEditing(false);
          setValidationErrors({});
          alert('Project updated successfully!');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes. Check your Supabase configuration.');
    }
  };

  const handleNewProject = () => {
    const newProject = {
      id: `new-${Date.now()}`,
      title: '',
      badgeType: 'UX Design',
      heroImage: '',
      summary: '',
      businessdetails: '',
      situation: '',
      task: '',
      action: '',
      output: '',
      lessonsLearned: '',
      metrics: [],
      images: [],
      is_visible: true,
      sort_order: displayProjects.length + 1,
      url_slug: '',
      show_on_homepage: false,
      homepage_display_order: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActiveProject(newProject);
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      alert('Supabase not configured. Please set up your .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      return;
    }

    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please select an image smaller than 10MB.');
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      console.log('Uploading to:', filePath);

      const { data, error } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error details:', error);
        
        // Provide specific error messages
          if (error.message.includes('Bucket not found')) {
            alert('Storage bucket "site_images" not found. Please create it in your Supabase dashboard.');
        } else if (error.message.includes('permission')) {
          alert('Permission denied. Please check your Supabase Storage policies.');
        } else {
          alert(`Upload failed: ${error.message}`);
        }
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);

      console.log('Upload successful, URL:', urlData.publicUrl);

      // Update project with new image URL
      if (activeProject) {
        setActiveProject({...activeProject, heroImage: urlData.publicUrl});
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Metrics management functions
  const addMetric = () => {
    const newMetric = {
      value: '',
      title: '',
      description: ''
    };
    setActiveProject({
      ...activeProject,
      metrics: [...(activeProject?.metrics || []), newMetric]
    } as any);
  };

  const removeMetric = (index: number) => {
    if (!activeProject) return;
    const updatedMetrics = activeProject.metrics.filter((_, i) => i !== index);
    setActiveProject({
      ...activeProject,
      metrics: updatedMetrics
    } as any);
  };

  const updateMetric = (index: number, field: 'value' | 'title' | 'description', value: string) => {
    if (!activeProject) return;
    const updatedMetrics = activeProject.metrics.map((metric, i) => 
      i === index ? { ...metric, [field]: value } : metric
    );
    setActiveProject({
      ...activeProject,
      metrics: updatedMetrics
    } as any);
  };

  // Use Supabase data if available, fallback to mock data
  // Sort projects by last edited (updatedAt) - most recent first
  const displayProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA; // Descending order (newest first)
  });
  const displayVentures = ventures;
  
  // Debug logging
  console.log('AdminPage - Projects count:', projects.length);
  console.log('AdminPage - Display projects:', displayProjects);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-gray-900">Content Management</h1>
          <div className="flex items-center gap-4">
            {userEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Manage your portfolio projects and resume content. Projects can be assigned to either the Design Work page or Ventures page using the Badge Type.
        </p>
        
        {/* Supabase Connection Status */}
        {showSupabaseWarning && (projectsError || venturesError || resumeError) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Using demo data. Configure Supabase for persistent storage.
                See <code className="bg-blue-100 px-1 rounded text-xs">SUPABASE_SETUP.md</code> for setup instructions.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSupabaseWarning(false)}
              className="text-blue-700 border-blue-300 hover:bg-blue-100 text-xs"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Loading States */}
        {(projectsLoading || venturesLoading || resumeLoading) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading data from Supabase...</p>
          </div>
        )}

        {/* Error States */}
        {(projectsError || venturesError || resumeError) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Error connecting to Supabase: {projectsError || venturesError || resumeError}
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="projects" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {!activeProject ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No project selected</p>
              <Button onClick={handleNewProject} className="bg-gray-900 hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
          <>
          <div className="flex justify-between items-center">
            <h2 className="text-gray-900">Manage Projects</h2>
            <Button 
              className="flex items-center gap-2"
              onClick={handleNewProject}
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project List */}
            <Card className="p-4">
              <h3 className="text-gray-900 mb-4">Projects</h3>
              <div className="space-y-2">
                {displayProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeProject.id === project.id
                        ? 'bg-gray-100 border border-gray-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveProject(project as any)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm">{project.title}</div>
                          {!(project as any).is_visible && (
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{project.badgeType}</Badge>
                          <span className="text-xs text-gray-500">Order: {(project as any).sort_order || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProject(project as any);
                            setIsEditing(false);
                          }}
                          title="View Project"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProject(project as any);
                            setIsEditing(true);
                          }}
                          title="Edit Project"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                              const wasActiveProject = activeProject.id === project.id;
                              console.log('Deleting project:', project.id);
                              
                              const success = await removeProject(project.id);
                              console.log('Delete success:', success);
                              console.log('Current projects count:', projects.length);
                              console.log('Display projects count:', displayProjects.length);
                              
                              if (success) {
                                console.log('Project deleted successfully, updating UI...');
                                
                                // Wait a moment for state to update, then select a new project
                                setTimeout(() => {
                                  if (wasActiveProject) {
                                    const currentProjects = projects;
                                    const remainingProjects = currentProjects.filter(p => p.id !== project.id);
                                    
                                    console.log('Remaining projects:', remainingProjects.length);
                                    
                                    if (remainingProjects.length > 0) {
                                      setActiveProject(remainingProjects[0] as any);
                                      setIsEditing(false);
                                    }
                                  }
                                }, 100);
                              } else {
                                console.error('Delete returned false');
                                alert('Failed to delete project. Check the console for details.');
                              }
                            }
                          }}
                          title="Delete Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Project Editor */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Edit Project</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        // Cancel editing - reload the original project data
                        const originalProject = displayProjects.find(p => p.id === activeProject.id);
                        if (originalProject) {
                          setActiveProject(originalProject as any);
                        }
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                  {isEditing && (
                    <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={activeProject?.title || ''}
                      onChange={(e) => activeProject && setActiveProject({...activeProject, title: e.target.value})}
                      disabled={!isEditing}
                      className={`mt-1 ${validationErrors.title ? 'border-red-500' : ''}`}
                      placeholder="Enter project title..."
                    />
                    {validationErrors.title && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="badge">Badge Type</Label>
                    <Select 
                      disabled={!isEditing}
                      value={activeProject.badgeType}
                      onValueChange={(value) => setActiveProject({...activeProject, badgeType: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={activeProject.badgeType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UX Design">UX Design</SelectItem>
                        <SelectItem value="UX Strategy">UX Strategy</SelectItem>
                        <SelectItem value="Ventures">Ventures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Hero Image */}
                <div>
                  <Label>Hero Image *</Label>
                  <div className="mt-2 space-y-3">
                    {activeProject.heroImage ? (
                      <div className="aspect-[16/10] max-w-md overflow-hidden rounded-lg border">
                        <ImageWithFallback
                          src={activeProject.heroImage}
                          alt={activeProject.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] max-w-md border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No image selected</p>
                      </div>
                    )}
                    {isEditing && (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={triggerFileUpload} 
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </Button>
                        <div className="text-xs text-gray-500">
                          Or enter image URL:
                        </div>
                        <Input
                          value={activeProject.heroImage}
                          onChange={(e) => setActiveProject({...activeProject, heroImage: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          className={`${validationErrors.heroImage ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.heroImage && (
                          <p className="text-red-500 text-xs">{validationErrors.heroImage}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <Label htmlFor="summary">Summary *</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      key={`summary-${activeProject.id}-${isEditing}`}
                      content={activeProject.summary || ''}
                      onChange={(content) => setActiveProject({...activeProject, summary: content})}
                      placeholder="Brief description of the project (shown on cards)..."
                      disabled={!isEditing}
                      className="min-h-[200px]"
                    />
                  </div>
                  {validationErrors.summary && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.summary}</p>
                  )}
                </div>

                {/* Business Details */}
                <div>
                  <Label htmlFor="businessdetails">Business Details</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      key={`businessdetails-${activeProject.id}-${isEditing}`}
                      content={activeProject.businessdetails || ''}
                      onChange={(content) => setActiveProject({...activeProject, businessdetails: content})}
                      placeholder="Detailed business context and information..."
                      disabled={!isEditing}
                      className="min-h-[200px]"
                    />
                  </div>
                </div>

                {/* Content Management Controls */}
                <div className="space-y-4">
                  <h4 className="text-gray-900">Content Management</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Visibility Toggle */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="visibility"
                        checked={activeProject.is_visible || false}
                        onChange={(e) => setActiveProject({...activeProject, is_visible: e.target.checked})}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="visibility" className="text-sm">
                        Show on {activeProject.badgeType === 'Ventures' ? 'Ventures' : 'Design Work'} page
                      </Label>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <Label htmlFor="sortOrder">Display Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={activeProject.sort_order || 0}
                        onChange={(e) => setActiveProject({...activeProject, sort_order: parseInt(e.target.value) || 0})}
                        disabled={!isEditing}
                        className="mt-1"
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    {/* URL Slug */}
                    <div>
                      <Label htmlFor="urlSlug">URL Slug *</Label>
                      <Input
                        id="urlSlug"
                        value={activeProject.url_slug || ''}
                        onChange={(e) => setActiveProject({...activeProject, url_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')})}
                        disabled={!isEditing}
                        className={`mt-1 ${validationErrors.url_slug ? 'border-red-500' : ''}`}
                        placeholder="project-url-slug"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL: /{activeProject.badgeType === 'Ventures' ? 'ventures' : 'design-work'}/{activeProject.url_slug || 'project-url-slug'}
                      </p>
                      {validationErrors.url_slug && (
                        <p className="text-red-500 text-xs">{validationErrors.url_slug}</p>
                      )}
                    </div>
                  </div>

                  {/* Featured Projects Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Show on Homepage */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showOnHomepage"
                        checked={activeProject.show_on_homepage || false}
                        onChange={(e) => setActiveProject({...activeProject, show_on_homepage: e.target.checked})}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="showOnHomepage" className="text-sm">
                        Show on Homepage
                      </Label>
                    </div>

                    {/* Homepage Display Order */}
                    <div>
                      <Label htmlFor="homepageDisplayOrder">Homepage Display Order (1-8)</Label>
                      <Input
                        id="homepageDisplayOrder"
                        type="number"
                        min="1"
                        max="8"
                        value={activeProject.homepage_display_order || ''}
                        onChange={(e) => setActiveProject({...activeProject, homepage_display_order: e.target.value ? parseInt(e.target.value) : null})}
                        disabled={!isEditing || !activeProject.show_on_homepage}
                        className="mt-1"
                        placeholder="1-8"
                      />
                    </div>
                  </div>
                </div>

                {/* STAR Content */}
                <div className="space-y-4">
                  <h4 className="text-gray-900">STAR Content</h4>
                  
                  <div>
                    <Label htmlFor="situation">Problem</Label>
                    <div className="mt-1">
                      <RichTextEditor
                        key={`situation-${activeProject.id}-${isEditing}`}
                        content={activeProject.situation || ''}
                        onChange={(content) => setActiveProject({...activeProject, situation: content})}
                        placeholder="Describe the problem or challenge that needed to be solved..."
                        disabled={!isEditing}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="task">Objective</Label>
                    <div className="mt-1">
                      <RichTextEditor
                        key={`task-${activeProject.id}-${isEditing}`}
                        content={activeProject.task || ''}
                        onChange={(content) => setActiveProject({...activeProject, task: content})}
                        placeholder="What was the goal or objective you were trying to achieve..."
                        disabled={!isEditing}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="action">Actions</Label>
                    <div className="mt-1">
                      <RichTextEditor
                        key={`action-${activeProject.id}-${isEditing}`}
                        content={activeProject.action || ''}
                        onChange={(content) => setActiveProject({...activeProject, action: content})}
                        placeholder="Describe the specific actions you took to address the problem..."
                        disabled={!isEditing}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="output">Output</Label>
                    <div className="mt-1">
                      <RichTextEditor
                        key={`output-${activeProject.id}-${isEditing}`}
                        content={activeProject.output || ''}
                        onChange={(content) => setActiveProject({...activeProject, output: content})}
                        placeholder="What were the measurable outputs and outcomes achieved..."
                        disabled={!isEditing}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lessons">Lessons</Label>
                    <div className="mt-1">
                      <RichTextEditor
                        key={`lessons-${activeProject.id}-${isEditing}`}
                        content={activeProject.lessonsLearned || ''}
                        onChange={(content) => setActiveProject({...activeProject, lessonsLearned: content})}
                        placeholder="What key lessons were learned from this project..."
                        disabled={!isEditing}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-900">Metrics & Output</h4>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMetric}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Metric
                      </Button>
                    )}
                  </div>

                  {activeProject.metrics && activeProject.metrics.length > 0 ? (
                    <div className="space-y-4">
                      {activeProject.metrics.map((metric, index) => (
                        <Card key={index} className="p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700">Metric Card {index + 1}</h5>
                              {/* Preview of how the metric will appear */}
                              {metric.value && metric.title && (
                                <div className="mt-2 p-2 bg-gray-50 rounded border text-xs">
                                  <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                                  <div className="text-sm text-gray-600">{metric.title}</div>
                                  {metric.description && (
                                    <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
                                  )}
                                </div>
                              )}
                            </div>
                            {isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMetric(index)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Remove Metric"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Metric Value */}
                            <div>
                              <Label htmlFor={`metric-value-${index}`} className="text-sm">
                                Metric Value *
                              </Label>
                              <Input
                                id={`metric-value-${index}`}
                                value={metric.value}
                                onChange={(e) => updateMetric(index, 'value', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 ${validationErrors[`metric-value-${index}`] ? 'border-red-500' : ''}`}
                                placeholder="e.g., 150%, 2.5M, 95%"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Number or percentage
                              </p>
                              {validationErrors[`metric-value-${index}`] && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors[`metric-value-${index}`]}</p>
                              )}
                            </div>

                            {/* Metric Title */}
                            <div>
                              <Label htmlFor={`metric-title-${index}`} className="text-sm">
                                Metric Title *
                              </Label>
                              <Input
                                id={`metric-title-${index}`}
                                value={metric.title}
                                onChange={(e) => updateMetric(index, 'title', e.target.value)}
                                disabled={!isEditing}
                                className={`mt-1 ${validationErrors[`metric-title-${index}`] ? 'border-red-500' : ''}`}
                                placeholder="e.g., User Engagement, Conversion Rate"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                What kind of metric
                              </p>
                              {validationErrors[`metric-title-${index}`] && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors[`metric-title-${index}`]}</p>
                              )}
                            </div>

                            {/* Metric Description */}
                            <div>
                              <Label htmlFor={`metric-description-${index}`} className="text-sm">
                                Description
                              </Label>
                              <Textarea
                                id={`metric-description-${index}`}
                                value={metric.description}
                                onChange={(e) => updateMetric(index, 'description', e.target.value)}
                                disabled={!isEditing}
                                className="mt-1"
                                rows={2}
                                placeholder="Brief description of the metric..."
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 text-sm mb-2">No metrics added yet</p>
                      <p className="text-gray-400 text-xs">
                        Click "Add Metric" to create metric cards for this project
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
          </>
          )}
        </TabsContent>


        {/* Resume Tab */}
        <TabsContent value="resume">
          <ResumeAdmin />
        </TabsContent>

      </Tabs>

    </div>
  );
}