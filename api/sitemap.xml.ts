import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const baseUrl = 'https://kevinlaronda.com'
  const currentDate = new Date().toISOString().split('T')[0]

  try {
    // Fetch visible projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('url_slug, updated_at')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
    }

    // Fetch visible ventures
    const { data: ventures, error: venturesError } = await supabase
      .from('ventures')
      .select('url_slug, updated_at')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (venturesError) {
      console.error('Error fetching ventures:', venturesError)
    }

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/resume', priority: '0.9', changefreq: 'monthly' },
      { url: '/design-work', priority: '0.9', changefreq: 'weekly' },
      { url: '/ventures', priority: '0.8', changefreq: 'monthly' },
    ]

    // Build sitemap XML
    const projectPages = (projects || []).map((project: any) => ({
      url: `/design-work/${project.url_slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: project.updated_at ? new Date(project.updated_at).toISOString().split('T')[0] : currentDate
    }))

    const venturePages = (ventures || []).map((venture: any) => ({
      url: `/ventures/${venture.url_slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: venture.updated_at ? new Date(venture.updated_at).toISOString().split('T')[0] : currentDate
    }))

    const allPages = [...staticPages, ...projectPages, ...venturePages]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${'lastmod' in page ? page.lastmod : currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(sitemap)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return res.status(500).json({ error: 'Error generating sitemap' })
  }
}

