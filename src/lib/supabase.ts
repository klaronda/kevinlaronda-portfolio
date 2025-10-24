import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Please check your .env.local file.')
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database types (you'll need to generate these from your Supabase schema)
export interface Project {
  id: string
  title: string
  badgeType: string
  heroImage: string
  summary: string
  businessdetails: string
  situation: string
  task: string
  action: string
  output: string
  lessonsLearned: string
  metrics: Array<{
    value: string
    title: string
    description: string
  }>
  images: string[]
  is_visible: boolean
  sort_order: number
  url_slug: string
  show_on_homepage: boolean
  homepage_display_order: number | null
  createdAt: string
  updatedAt: string
}

export interface Venture {
  id: string
  title: string
  description: string
  image: string
  url?: string
  status: 'active' | 'completed' | 'on-hold'
  is_visible: boolean
  sort_order: number
  url_slug: string
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  start_month: number
  start_year: number
  end_month?: number
  end_year?: number
  is_current: boolean
  description: string
  achievements: string[]
  logo_url?: string
  sort_order: number
  createdAt: string
  updatedAt: string
}

export interface Education {
  id: string
  title: string
  institution: string
  year: number
  emphasis?: string
  logo_url?: string
  sort_order: number
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  name: string
  title: string
  bio?: string
  photo_url?: string
  createdAt: string
  updatedAt: string
}

export interface Resume {
  id: string
  experience: Experience[]
  skills: Array<{
    category: string
    items: string[]
  }>
  education: Education[]
  url_slug: string
  createdAt: string
  updatedAt: string
}

export interface PageUrl {
  id: string
  page_name: string
  url_slug: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}
