import { supabase, Project, Venture, Resume, Experience, Education, Profile } from './supabase'

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}

export const getVisibleProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching visible projects:', error)
    return []
  }

  return data || []
}

export const getProject = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data
}

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return null
  }

  return data
}

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return null
  }

  return data
}

export const deleteProject = async (id: string): Promise<boolean> => {
  console.log('deleteProject called with id:', id);
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return false
  }

  console.log('Project deleted successfully');
  return true
}

export const updateProjectVisibility = async (id: string, isVisible: boolean): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .update({ is_visible: isVisible, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project visibility:', error)
    return null
  }

  return data
}

export const updateProjectOrder = async (id: string, sortOrder: number): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .update({ sort_order: sortOrder, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project order:', error)
    return null
  }

  return data
}

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('url_slug', slug)
    .eq('is_visible', true)
    .single()

  if (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }

  return data
}

// Ventures
export const getVentures = async (): Promise<Venture[]> => {
  const { data, error } = await supabase
    .from('ventures')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching ventures:', error)
    return []
  }

  return data || []
}

export const getVenture = async (id: string): Promise<Venture | null> => {
  const { data, error } = await supabase
    .from('ventures')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching venture:', error)
    return null
  }

  return data
}

export const createVenture = async (venture: Omit<Venture, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venture | null> => {
  const { data, error } = await supabase
    .from('ventures')
    .insert([venture])
    .select()
    .single()

  if (error) {
    console.error('Error creating venture:', error)
    return null
  }

  return data
}

export const updateVenture = async (id: string, updates: Partial<Venture>): Promise<Venture | null> => {
  const { data, error } = await supabase
    .from('ventures')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating venture:', error)
    return null
  }

  return data
}

export const deleteVenture = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('ventures')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting venture:', error)
    return false
  }

  return true
}

// Resume
export const getResume = async (): Promise<Resume | null> => {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export const updateResume = async (updates: Partial<Resume>): Promise<Resume | null> => {
  const { data, error } = await supabase
    .from('profile')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

// Experience
export const getExperience = async (): Promise<Experience[]> => {
  console.log('getExperience - Starting fetch...');
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching experience:', error)
    console.error('Error details:', error.message, error.code, error.details)
    return []
  }

  console.log('getExperience - Raw data from database:', data);
  console.log('getExperience - Data structure:', data?.[0] ? Object.keys(data[0]) : 'No data');
  console.log('getExperience - Data length:', data?.length || 0);
  
  // Transform the data to match our interface
  const transformedData = data?.map(item => ({
    ...item,
    start_date: `${item.start_year}-${String(item.start_month).padStart(2, '0')}-01`,
    end_date: item.end_year && item.end_month ? `${item.end_year}-${String(item.end_month).padStart(2, '0')}-01` : null,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];
  
  console.log('getExperience - Transformed data:', transformedData);
  return transformedData;
}

export const createExperience = async (experience: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience | null> => {
  const { data, error } = await supabase
    .from('experience')
    .insert([experience])
    .select()
    .single()

  if (error) {
    console.error('Error creating experience:', error)
    return null
  }

  return data
}

export const updateExperience = async (id: string, updates: Partial<Experience>): Promise<Experience | null> => {
  const { data, error } = await supabase
    .from('experience')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating experience:', error)
    return null
  }

  return data
}

export const deleteExperience = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting experience:', error)
    return false
  }

  return true
}

// Education
export const getEducation = async (): Promise<Education[]> => {
  console.log('getEducation - Starting fetch...');
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching education:', error)
    console.error('Error details:', error.message, error.code, error.details)
    return []
  }

  console.log('getEducation - Raw data from database:', data);
  console.log('getEducation - Data structure:', data?.[0] ? Object.keys(data[0]) : 'No data');
  console.log('getEducation - Data length:', data?.length || 0);
  
  // Transform the data to match our interface
  const transformedData = data?.map(item => ({
    ...item,
    year: String(item.year), // Convert to string to match interface
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) || [];
  
  console.log('getEducation - Transformed data:', transformedData);
  return transformedData;
}

export const createEducation = async (education: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education | null> => {
  const { data, error } = await supabase
    .from('education')
    .insert([education])
    .select()
    .single()

  if (error) {
    console.error('Error creating education:', error)
    return null
  }

  return data
}

export const updateEducation = async (id: string, updates: Partial<Education>): Promise<Education | null> => {
  const { data, error } = await supabase
    .from('education')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating education:', error)
    return null
  }

  return data
}

export const deleteEducation = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting education:', error)
    return false
  }

  return true
}

// Profile
export const getProfile = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching profile:', error)
    return []
  }

  return data || []
}

export const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profile')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}
