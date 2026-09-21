export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://careandcurebysaima.com'
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: item.href ? new URL(item.href, origin).toString() : undefined })),
  }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.label}>{index ? <i aria-hidden="true">/</i> : null}{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</span>)}</nav></>
}
