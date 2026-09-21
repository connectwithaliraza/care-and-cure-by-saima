import './styles.css'
import type { Metadata } from 'next'
import { getSiteData } from '@/lib/siteData'

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getSiteData()
  const origin = `https://${site.domain}`
  return {
    metadataBase: new URL(origin),
    title: { default: seo.metaTitle, template: `%s | ${site.siteName}` },
    description: seo.metaDescription,
    applicationName: site.siteName,
    creator: site.doctorName,
    publisher: site.siteName,
    formatDetection: { email: false, address: false, telephone: false },
  }
}

export default function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
