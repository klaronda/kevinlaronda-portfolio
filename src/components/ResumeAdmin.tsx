import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RichTextEditor } from './RichTextEditor';
import { Upload, Save, Plus, Edit, Trash2, Eye, Minus, X } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';
import type { Experience, Education, Profile } from '../lib/supabase';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

export function ResumeAdmin() {
  const { experience, education, profile, refetchExperience, refetchEducation, refetchProfile } = useSupabase();
  
  // Experience state
  const [activeExperience, setActiveExperience] = useState<Experience | null>(experience[0] || null);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [showNewExperience, setShowNewExperience] = useState(false);
  const experienceFileRef = useRef<HTMLInputElement>(null);

  // Education state
  const [activeEducation, setActiveEducation] = useState<Education | null>(education[0] || null);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [showNewEducation, setShowNewEducation] = useState(false);
  const educationFileRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const profileFileRef = useRef<HTMLInputElement>(null);

  // Initialize profile when data loads
  useEffect(() => {
    if (profile.length > 0) {
      setActiveProfile(profile[0]);
    } else if (profile.length === 0 && !activeProfile) {
      // Create a default profile if none exists
      const defaultProfile: Profile = {
        id: '', // Will be auto-generated when saved
        name: 'Kevin Laronda',
        title: 'UX Design Strategist',
        bio: '',
        photo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setActiveProfile(defaultProfile);
    }
  }, [profile, activeProfile]);

  // Refresh profile data on component mount
  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  // New experience object
  const newExperience: Omit<Experience, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    company: '',
    location: '',
    start_month: 1,
    start_year: new Date().getFullYear(),
    end_month: undefined,
    end_year: undefined,
    is_current: false,
    description: '',
    achievements: [],
    logo_url: '',
    sort_order: 0
  };

  // New education object
  const newEducation: Omit<Education, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    institution: '',
    year: new Date().getFullYear(),
    emphasis: '',
    logo_url: '',
    sort_order: 0
  };

  // New profile object
  const newProfile: Omit<Profile, 'id' | 'created_at' | 'updated_at'> = {
    name: 'Kevin Laronda',
    title: 'UX Design Strategist',
    bio: '',
    photo_url: ''
  };

  // Experience handlers
  const handleAddExperience = () => {
    setActiveExperience(newExperience as any);
    setIsEditingExperience(true);
    setShowNewExperience(true);
  };

  const handleEditExperience = (exp: Experience) => {
    setActiveExperience(exp);
    setIsEditingExperience(true);
    setShowNewExperience(false);
  };

  const handleSaveExperience = async () => {
    if (!activeExperience) return;

    try {
      if (showNewExperience) {
        const { data, error } = await supabase
          .from('experience')
          .insert([activeExperience])
          .select()
          .single();

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experience')
          .update(activeExperience)
          .eq('id', activeExperience.id);

        if (error) throw error;
      }

      setIsEditingExperience(false);
      setShowNewExperience(false);
      // Refresh experience data
      await refetchExperience();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;

    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (activeExperience?.id === id) {
        setActiveExperience(null);
        setIsEditingExperience(false);
      }
      
      // Refresh experience data
      await refetchExperience();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    setActiveEducation(newEducation as any);
    setIsEditingEducation(true);
    setShowNewEducation(true);
  };

  const handleEditEducation = (edu: Education) => {
    setActiveEducation(edu);
    setIsEditingEducation(true);
    setShowNewEducation(false);
  };

  const handleSaveEducation = async () => {
    if (!activeEducation) return;

    try {
      if (showNewEducation) {
        const { data, error } = await supabase
          .from('education')
          .insert([activeEducation])
          .select()
          .single();

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education')
          .update(activeEducation)
          .eq('id', activeEducation.id);

        if (error) throw error;
      }

      setIsEditingEducation(false);
      setShowNewEducation(false);
      // Refresh education data
      await refetchEducation();
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (activeEducation?.id === id) {
        setActiveEducation(null);
        setIsEditingEducation(false);
      }
      
      // Refresh education data
      await refetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Failed to delete education');
    }
  };

  // Profile handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!activeProfile) return;

    try {
      if (activeProfile.id && activeProfile.id !== '') {
        // Update existing profile
        const { data, error } = await supabase
          .from('profile')
          .update({
            name: activeProfile.name,
            title: activeProfile.title,
            bio: activeProfile.bio,
            photo_url: activeProfile.photo_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeProfile.id)
          .select()
          .single();

        if (error) throw error;
        setActiveProfile(data);
      } else {
        // Create new profile (remove the id field since it will be auto-generated)
        const { id, created_at, updated_at, ...profileData } = activeProfile;
        const { data, error } = await supabase
          .from('profile')
          .insert([profileData])
          .select()
          .single();

        if (error) throw error;
        setActiveProfile(data);
      }

      setIsEditingProfile(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  // Image upload handlers
  const handleImageUpload = async (type: 'experience' | 'education' | 'profile') => {
    const fileInput = type === 'experience' ? experienceFileRef.current :
                     type === 'education' ? educationFileRef.current :
                     profileFileRef.current;

    if (!fileInput) return;

    const file = fileInput.files?.[0];
    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image smaller than 5MB.');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `resume/${type}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);

      if (type === 'experience' && activeExperience) {
        setActiveExperience({ ...activeExperience, logo_url: urlData.publicUrl });
      } else if (type === 'education' && activeEducation) {
        setActiveEducation({ ...activeEducation, logo_url: urlData.publicUrl });
      } else if (type === 'profile' && activeProfile) {
        setActiveProfile({ ...activeProfile, photo_url: urlData.publicUrl });
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  };

  // Achievement handlers
  const addAchievement = () => {
    if (!activeExperience) return;
    setActiveExperience({
      ...activeExperience,
      achievements: [...activeExperience.achievements, '']
    });
  };

  const updateAchievement = (index: number, value: string) => {
    if (!activeExperience) return;
    const updated = [...activeExperience.achievements];
    updated[index] = value;
    setActiveExperience({ ...activeExperience, achievements: updated });
  };

  const removeAchievement = (index: number) => {
    if (!activeExperience) return;
    const updated = activeExperience.achievements.filter((_, i) => i !== index);
    setActiveExperience({ ...activeExperience, achievements: updated });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Management</h1>
        <p className="text-gray-600">Manage your professional experience, education, and profile information.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <div className="flex gap-2">
                {isEditingProfile ? (
                  <>
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)} size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEditProfile} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {!activeProfile ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Loading profile information...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {activeProfile.photo_url && (
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={activeProfile.photo_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {isEditingProfile && (
                      <div>
                        <input
                          ref={profileFileRef}
                          type="file"
                          accept="image/*"
                          onChange={() => handleImageUpload('profile')}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => profileFileRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={activeProfile.name}
                      onChange={(e) => setActiveProfile({ ...activeProfile, name: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={activeProfile.title}
                      onChange={(e) => setActiveProfile({ ...activeProfile, title: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      key={`bio-${activeProfile.id}-${isEditingProfile}`}
                      content={activeProfile.bio || ''}
                      onChange={(content) => setActiveProfile({...activeProfile, bio: content})}
                      placeholder="Brief professional bio with rich formatting..."
                      disabled={!isEditingProfile}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Professional Experience</h2>
            <Button onClick={handleAddExperience}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience List */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Experience Entries</h3>
              {experience.length > 0 ? (
                experience.map((exp) => (
                  <Card
                    key={exp.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeExperience?.id === exp.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => !isEditingExperience && setActiveExperience(exp)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">
                          {exp.is_current ? 'Current' : `${exp.start_year} - ${exp.end_year || 'Present'}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditExperience(exp);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExperience(exp.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No experience entries yet.</p>
              )}
            </div>

            {/* Experience Editor */}
            {activeExperience && (
              <Card className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  {showNewExperience ? 'Add New Experience' : 'Edit Experience'}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exp-title">Job Title</Label>
                      <Input
                        id="exp-title"
                        value={activeExperience.title}
                        onChange={(e) => setActiveExperience({ ...activeExperience, title: e.target.value })}
                        disabled={!isEditingExperience}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exp-company">Company</Label>
                      <Input
                        id="exp-company"
                        value={activeExperience.company}
                        onChange={(e) => setActiveExperience({ ...activeExperience, company: e.target.value })}
                        disabled={!isEditingExperience}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exp-location">Location</Label>
                    <Input
                      id="exp-location"
                      value={activeExperience.location}
                      onChange={(e) => setActiveExperience({ ...activeExperience, location: e.target.value })}
                      disabled={!isEditingExperience}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exp-start-month">Start Month</Label>
                      <Select
                        value={activeExperience.start_month.toString()}
                        onValueChange={(value) => setActiveExperience({ ...activeExperience, start_month: parseInt(value) })}
                        disabled={!isEditingExperience}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((month) => (
                            <SelectItem key={month.value} value={month.value.toString()}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exp-start-year">Start Year</Label>
                      <Input
                        id="exp-start-year"
                        type="number"
                        value={activeExperience.start_year}
                        onChange={(e) => setActiveExperience({ ...activeExperience, start_year: parseInt(e.target.value) })}
                        disabled={!isEditingExperience}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="exp-current"
                      checked={activeExperience.is_current}
                      onChange={(e) => setActiveExperience({ ...activeExperience, is_current: e.target.checked })}
                      disabled={!isEditingExperience}
                      className="rounded"
                    />
                    <Label htmlFor="exp-current">Currently working here</Label>
                  </div>

                  {!activeExperience.is_current && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exp-end-month">End Month</Label>
                        <Select
                          value={activeExperience.end_month?.toString() || ''}
                          onValueChange={(value) => setActiveExperience({ ...activeExperience, end_month: parseInt(value) })}
                          disabled={!isEditingExperience}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="exp-end-year">End Year</Label>
                        <Input
                          id="exp-end-year"
                          type="number"
                          value={activeExperience.end_year || ''}
                          onChange={(e) => setActiveExperience({ ...activeExperience, end_year: parseInt(e.target.value) })}
                          disabled={!isEditingExperience}
                        />
                      </div>
                    </div>
                  )}

                  {/* Company Logo Upload */}
                  <div>
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {activeExperience.logo_url && (
                        <div className="w-16 h-16 border rounded flex items-center justify-center">
                          <ImageWithFallback
                            src={activeExperience.logo_url}
                            alt="Company logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      {isEditingExperience && (
                        <div>
                          <input
                            ref={experienceFileRef}
                            type="file"
                            accept="image/*"
                            onChange={() => handleImageUpload('experience')}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => experienceFileRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exp-description">Role Description</Label>
                    <Textarea
                      id="exp-description"
                      value={activeExperience.description}
                      onChange={(e) => setActiveExperience({ ...activeExperience, description: e.target.value })}
                      disabled={!isEditingExperience}
                      rows={3}
                    />
                  </div>

                  {/* Key Achievements */}
                  <div>
                    <Label>Key Achievements</Label>
                    <div className="space-y-2 mt-2">
                      {activeExperience.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(index, e.target.value)}
                            disabled={!isEditingExperience}
                            placeholder="Enter achievement..."
                          />
                          {isEditingExperience && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditingExperience && (
                        <Button variant="outline" size="sm" onClick={addAchievement}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Achievement
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exp-sort">Display Order</Label>
                    <Input
                      id="exp-sort"
                      type="number"
                      value={activeExperience.sort_order}
                      onChange={(e) => setActiveExperience({ ...activeExperience, sort_order: parseInt(e.target.value) })}
                      disabled={!isEditingExperience}
                    />
                  </div>

                  {isEditingExperience && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveExperience}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Experience
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingExperience(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Education & Certifications</h2>
            <Button onClick={handleAddEducation}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education List */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Education Entries</h3>
              {education.length > 0 ? (
                education.map((edu) => (
                  <Card
                    key={edu.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeEducation?.id === edu.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => !isEditingEducation && setActiveEducation(edu)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{edu.title}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.year}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEducation(edu);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEducation(edu.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No education entries yet.</p>
              )}
            </div>

            {/* Education Editor */}
            {activeEducation && (
              <Card className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  {showNewEducation ? 'Add New Education' : 'Edit Education'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edu-title">Degree/Certification Title</Label>
                    <Input
                      id="edu-title"
                      value={activeEducation.title}
                      onChange={(e) => setActiveEducation({ ...activeEducation, title: e.target.value })}
                      disabled={!isEditingEducation}
                      placeholder="e.g., Bachelor of Arts, Google Analytics Certification"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edu-institution">Institution/Company</Label>
                    <Input
                      id="edu-institution"
                      value={activeEducation.institution}
                      onChange={(e) => setActiveEducation({ ...activeEducation, institution: e.target.value })}
                      disabled={!isEditingEducation}
                      placeholder="e.g., University of California, Google"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edu-year">Year</Label>
                    <Input
                      id="edu-year"
                      type="number"
                      value={activeEducation.year}
                      onChange={(e) => setActiveEducation({ ...activeEducation, year: parseInt(e.target.value) })}
                      disabled={!isEditingEducation}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edu-emphasis">Emphasis/Field (Optional)</Label>
                    <Input
                      id="edu-emphasis"
                      value={activeEducation.emphasis || ''}
                      onChange={(e) => setActiveEducation({ ...activeEducation, emphasis: e.target.value })}
                      disabled={!isEditingEducation}
                      placeholder="e.g., Psychology, Digital Marketing"
                    />
                  </div>

                  {/* Institution Logo Upload */}
                  <div>
                    <Label>Institution Logo</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {activeEducation.logo_url && (
                        <div className="w-16 h-16 border rounded flex items-center justify-center">
                          <ImageWithFallback
                            src={activeEducation.logo_url}
                            alt="Institution logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      {isEditingEducation && (
                        <div>
                          <input
                            ref={educationFileRef}
                            type="file"
                            accept="image/*"
                            onChange={() => handleImageUpload('education')}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => educationFileRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edu-sort">Display Order</Label>
                    <Input
                      id="edu-sort"
                      type="number"
                      value={activeEducation.sort_order}
                      onChange={(e) => setActiveEducation({ ...activeEducation, sort_order: parseInt(e.target.value) })}
                      disabled={!isEditingEducation}
                    />
                  </div>

                  {isEditingEducation && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveEducation}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Education
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingEducation(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
