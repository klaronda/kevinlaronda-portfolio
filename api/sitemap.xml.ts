import { createClient } from '@supabase/supabase-js'

const DESIGN_WORK_BADGES = ['UX Design', 'UX Strategy', 'Manager'] as const

function formatLastmod(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  return new Date(value).toISOString().split('T')[0]
}

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
    const [projectsResult, seriesResult] = await Promise.all([
      supabase
        .from('projects')
        .select('url_slug, updatedAt, badgeType')
        .eq('is_visible', true)
        .neq('url_slug', '')
        .order('sort_order', { ascending: true }),
      supabase
        .from('series')
        .select('url_slug, updated_at, badge_type')
        .eq('is_visible', true)
        .neq('url_slug', '')
        .order('sort_order', { ascending: true }),
    ])

    if (projectsResult.error) {
      console.error('Error fetching projects:', projectsResult.error)
      return res.status(500).json({ error: 'Error fetching projects' })
    }

    if (seriesResult.error) {
      console.error('Error fetching series:', seriesResult.error)
      return res.status(500).json({ error: 'Error fetching series' })
    }

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/resume', priority: '0.9', changefreq: 'monthly' },
      { url: '/design-work', priority: '0.9', changefreq: 'weekly' },
      { url: '/ventures', priority: '0.8', changefreq: 'monthly' },
    ]

    const designWorkProjectPages = (projectsResult.data || [])
      .filter((project) => DESIGN_WORK_BADGES.includes(project.badgeType))
      .map((project) => ({
        url: `/design-work/${project.url_slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: formatLastmod(project.updatedAt, currentDate),
      }))

    const ventureProjectPages = (projectsResult.data || [])
      .filter((project) => project.badgeType === 'Ventures')
      .map((project) => ({
        url: `/ventures/${project.url_slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: formatLastmod(project.updatedAt, currentDate),
      }))

    const designWorkSeriesPages = (seriesResult.data || [])
      .filter((series) => series.badge_type === 'Design Work')
      .map((series) => ({
        url: `/design-work/${series.url_slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: formatLastmod(series.updated_at, currentDate),
      }))

    const ventureSeriesPages = (seriesResult.data || [])
      .filter((series) => series.badge_type === 'Ventures')
      .map((series) => ({
        url: `/ventures/${series.url_slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: formatLastmod(series.updated_at, currentDate),
      }))

    const seenUrls = new Set<string>()
    const dynamicPages = [
      ...designWorkSeriesPages,
      ...designWorkProjectPages,
      ...ventureSeriesPages,
      ...ventureProjectPages,
    ].filter((page) => {
      if (seenUrls.has(page.url)) return false
      seenUrls.add(page.url)
      return true
    })

    const allPages = [...staticPages, ...dynamicPages]

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

