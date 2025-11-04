import { supabase, Project, Venture, Resume, Experience, Education, Profile, Series } from './supabase'

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
  // Exclude overview if it's empty to avoid errors if column doesn't exist yet
  const { overview, ...projectWithoutOverview } = project;
  const projectData: any = { ...projectWithoutOverview };
  
  // Only include overview if it has a value (assuming column exists)
  // If column doesn't exist, user will need to add it first
  if (overview !== undefined && overview !== null && overview !== '') {
    projectData.overview = overview;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    // If error is about overview column, provide helpful message
    if (error.message?.includes('overview') || error.code === 'PGRST116' || error.message?.includes('column') || error.code === '42703') {
      console.error('Note: The "overview" column may not exist in your database. Please add it via SQL:\nALTER TABLE projects ADD COLUMN overview TEXT DEFAULT \'\';')
    }
    return null
  }

  return data
}

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  console.log('updateProject called with id:', id);
  console.log('updateProject updates:', updates);
  console.log('updateProject badgeType:', updates.badgeType);
  console.log('updateProject series_id:', updates.series_id);
  
  // Exclude overview if it's empty to avoid errors if column doesn't exist yet
  const { overview, ...updatesWithoutOverview } = updates;
  const updateData: any = { ...updatesWithoutOverview, updatedAt: new Date().toISOString() };
  
  // Only include overview if it has a value (assuming column exists)
  // If column doesn't exist, user will need to add it first
  if (overview !== undefined && overview !== null && overview !== '') {
    updateData.overview = overview;
  }
  
  // Ensure badgeType is included (Supabase might need it as "badgeType" or "badge_type")
  // Try both formats if needed
  if (updates.badgeType !== undefined) {
    updateData.badgeType = updates.badgeType;
    // Also try snake_case version in case DB uses that
    // updateData.badge_type = updates.badgeType;
  }
  
  console.log('updateProject - Final updateData being sent:', updateData);
  
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    // If error is about overview column, provide helpful message
    if (error.message?.includes('overview') || error.code === 'PGRST116' || error.message?.includes('column') || error.code === '42703') {
      console.error('Note: The "overview" column may not exist in your database. Please add it via SQL:\nALTER TABLE projects ADD COLUMN overview TEXT DEFAULT \'\';')
    }
    // If error is about badgeType/badge_type
    if (error.message?.includes('badge') || error.message?.includes('Badge')) {
      console.error('Note: There may be a column name mismatch. Check if your database uses "badgeType" (camelCase) or "badge_type" (snake_case).')
    }
    return null
  }

  console.log('updateProject success, returned data:', data);
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

export const getVentureBySlug = async (slug: string): Promise<Venture | null> => {
  const { data, error } = await supabase
    .from('ventures')
    .select('*')
    .eq('url_slug', slug)
    .single()

  if (error) {
    console.error('Error fetching venture by slug:', error)
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

// Series
export const getSeries = async (): Promise<Series[]> => {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching series:', error)
    return []
  }

  return data || []
}

export const getSeriesById = async (id: string): Promise<Series | null> => {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching series by id:', error)
    return null
  }

  return data
}

export const getSeriesBySlug = async (slug: string): Promise<Series | null> => {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('url_slug', slug)
    .single()

  if (error) {
    console.error('Error fetching series by slug:', error)
    return null
  }

  return data
}

export const createSeries = async (series: Omit<Series, 'id' | 'created_at' | 'updated_at'>): Promise<Series | null> => {
  const { data, error } = await supabase
    .from('series')
    .insert([series])
    .select()
    .single()

  if (error) {
    console.error('Error creating series:', error)
    return null
  }

  return data
}

export const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series | null> => {
  const { data, error } = await supabase
    .from('series')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating series:', error)
    return null
  }

  return data
}

export const deleteSeries = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting series:', error)
    return false
  }

  return true
}

export const getProjectsBySeries = async (seriesId: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('series_id', seriesId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching projects by series:', error)
    return []
  }

  return data || []
}
