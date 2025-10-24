import { useState, useEffect } from 'react'
import { supabase, Project, Venture, Resume, Experience, Education, Profile } from '../lib/supabase'
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  getVentures,
  getVenture,
  createVenture,
  updateVenture,
  deleteVenture,
  getResume,
  updateResume,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  getProfile,
  updateProfile
} from '../lib/database'

// Projects hooks
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProject = await createProject(project)
      if (newProject) {
        setProjects(prev => [newProject, ...prev])
      }
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
      return null
    }
  }

  const editProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await updateProject(id, updates)
      if (updatedProject) {
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      }
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      return null
    }
  }

  const removeProject = async (id: string) => {
    try {
      const success = await deleteProject(id)
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      return false
    }
  }

  return {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    refetch: fetchProjects
  }
}

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProject(id)
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project')
    } finally {
      setLoading(false)
    }
  }

  return {
    project,
    loading,
    error,
    refetch: fetchProject
  }
}

// Ventures hooks
export const useVentures = () => {
  const [ventures, setVentures] = useState<Venture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVentures()
  }, [])

  const fetchVentures = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getVentures()
      setVentures(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ventures')
    } finally {
      setLoading(false)
    }
  }

  const addVenture = async (venture: Omit<Venture, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newVenture = await createVenture(venture)
      if (newVenture) {
        setVentures(prev => [newVenture, ...prev])
      }
      return newVenture
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create venture')
      return null
    }
  }

  const editVenture = async (id: string, updates: Partial<Venture>) => {
    try {
      const updatedVenture = await updateVenture(id, updates)
      if (updatedVenture) {
        setVentures(prev => prev.map(v => v.id === id ? updatedVenture : v))
      }
      return updatedVenture
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update venture')
      return null
    }
  }

  const removeVenture = async (id: string) => {
    try {
      const success = await deleteVenture(id)
      if (success) {
        setVentures(prev => prev.filter(v => v.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete venture')
      return false
    }
  }

  return {
    ventures,
    loading,
    error,
    addVenture,
    editVenture,
    removeVenture,
    refetch: fetchVentures
  }
}

// Resume hook
export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getResume()
      setResume(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resume')
    } finally {
      setLoading(false)
    }
  }

  const updateResumeData = async (updates: Partial<Resume>) => {
    try {
      const updatedResume = await updateResume(updates)
      if (updatedResume) {
        setResume(updatedResume)
      }
      return updatedResume
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume')
      return null
    }
  }

  return {
    resume,
    loading,
    error,
    updateResume: updateResumeData,
    refetch: fetchResume
  }
}

// Experience hooks
export const useExperience = () => {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExperience()
  }, [])

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getExperience()
      setExperience(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experience')
    } finally {
      setLoading(false)
    }
  }

  const addExperience = async (exp: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newExp = await createExperience(exp)
      if (newExp) {
        setExperience(prev => [newExp, ...prev])
      }
      return newExp
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create experience')
      return null
    }
  }

  const editExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      const updatedExp = await updateExperience(id, updates)
      if (updatedExp) {
        setExperience(prev => prev.map(exp => exp.id === id ? updatedExp : exp))
      }
      return updatedExp
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update experience')
      return null
    }
  }

  const removeExperience = async (id: string) => {
    try {
      const success = await deleteExperience(id)
      if (success) {
        setExperience(prev => prev.filter(exp => exp.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete experience')
      return false
    }
  }

  return {
    experience,
    loading,
    error,
    addExperience,
    editExperience,
    removeExperience,
    refetch: fetchExperience
  }
}

// Education hooks
export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEducation()
      setEducation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch education')
    } finally {
      setLoading(false)
    }
  }

  const addEducation = async (edu: Omit<Education, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newEdu = await createEducation(edu)
      if (newEdu) {
        setEducation(prev => [newEdu, ...prev])
      }
      return newEdu
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create education')
      return null
    }
  }

  const editEducation = async (id: string, updates: Partial<Education>) => {
    try {
      const updatedEdu = await updateEducation(id, updates)
      if (updatedEdu) {
        setEducation(prev => prev.map(edu => edu.id === id ? updatedEdu : edu))
      }
      return updatedEdu
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update education')
      return null
    }
  }

  const removeEducation = async (id: string) => {
    try {
      const success = await deleteEducation(id)
      if (success) {
        setEducation(prev => prev.filter(edu => edu.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete education')
      return false
    }
  }

  return {
    education,
    loading,
    error,
    addEducation,
    editEducation,
    removeEducation,
    refetch: fetchEducation
  }
}

// Profile hooks
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfileData = async (updates: Partial<Profile>) => {
    try {
      const updatedProfile = await updateProfile(updates)
      if (updatedProfile) {
        setProfile([updatedProfile])
      }
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      return null
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile: updateProfileData,
    refetch: fetchProfile
  }
}

// Main hook that combines all data
export const useSupabase = () => {
  const projectsHook = useProjects()
  const venturesHook = useVentures()
  const resumeHook = useResume()
  const experienceHook = useExperience()
  const educationHook = useEducation()
  const profileHook = useProfile()

  return {
    // Projects
    projects: projectsHook.projects,
    projectsLoading: projectsHook.loading,
    projectsError: projectsHook.error,
    addProject: projectsHook.addProject,
    editProject: projectsHook.editProject,
    removeProject: projectsHook.removeProject,
    refetchProjects: projectsHook.refetch,
    
    // Ventures
    ventures: venturesHook.ventures,
    venturesLoading: venturesHook.loading,
    venturesError: venturesHook.error,
    addVenture: venturesHook.addVenture,
    editVenture: venturesHook.editVenture,
    removeVenture: venturesHook.removeVenture,
    refetchVentures: venturesHook.refetch,
    
    // Resume
    resume: resumeHook.resume,
    resumeLoading: resumeHook.loading,
    resumeError: resumeHook.error,
    updateResume: resumeHook.updateResume,
    refetchResume: resumeHook.refetch,
    
    // Experience
    experience: experienceHook.experience,
    experienceLoading: experienceHook.loading,
    experienceError: experienceHook.error,
    addExperience: experienceHook.addExperience,
    editExperience: experienceHook.editExperience,
    removeExperience: experienceHook.removeExperience,
    refetchExperience: experienceHook.refetch,
    
    // Education
    education: educationHook.education,
    educationLoading: educationHook.loading,
    educationError: educationHook.error,
    addEducation: educationHook.addEducation,
    editEducation: educationHook.editEducation,
    removeEducation: educationHook.removeEducation,
    refetchEducation: educationHook.refetch,
    
    // Profile
    profile: profileHook.profile,
    profileLoading: profileHook.loading,
    profileError: profileHook.error,
    updateProfile: profileHook.updateProfile,
    refetchProfile: profileHook.refetch,
    
    // Overall loading state
    loading: projectsHook.loading || venturesHook.loading || resumeHook.loading || 
             experienceHook.loading || educationHook.loading || profileHook.loading,
    error: projectsHook.error || venturesHook.error || resumeHook.error || 
           experienceHook.error || educationHook.error || profileHook.error
  }
}
