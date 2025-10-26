import Link from 'next/link'
import Image from 'next/image'
import { memo } from 'react'

interface SEOLinkProps {
  href: string
  children: React.ReactNode
  title?: string
  className?: string
  rel?: string
  target?: string
  'aria-label'?: string
}

// SEO-optimized internal link component
export const SEOLink = memo(({
  href,
  children,
  title,
  className,
  rel,
  target,
  'aria-label': ariaLabel
}: SEOLinkProps) => {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  const isDownload = href.includes('/download/') || href.endsWith('.pdf')
  
  const linkProps = {
    title,
    className,
    'aria-label': ariaLabel,
    ...(isExternal && {
      target: target || '_blank',
      rel: rel || 'noopener noreferrer'
    }),
    ...(isDownload && {
      rel: rel || 'nofollow'
    })
  }

  if (isExternal) {
    return (
      <a href={href} {...linkProps}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...linkProps}>
      {children}
    </Link>
  )
})

// Related content component for internal linking
export const RelatedContentSEO = memo(({ 
  items,
  title = "Related Content"
}: { 
  items: Array<{
    title: string
    url: string
    description?: string
    image?: string
    category?: string
  }>
  title?: string
}) => {
  return (
    <section className="related-content-seo bg-gray-50 p-6 rounded-lg">
      <h3 className="related-title text-2xl font-bold mb-6 text-center">{title}</h3>
      
      <div className="related-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <article key={index} className="related-item bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {item.image && (
              <div className="related-image">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            )}
            
            <div className="related-content p-4">
              {item.category && (
                <span className="related-category text-xs text-primary font-medium uppercase tracking-wide">
                  {item.category}
                </span>
              )}
              
              <h4 className="related-item-title font-semibold mb-2 hover:text-primary transition-colors">
                <SEOLink 
                  href={item.url}
                  title={`Read more about ${item.title}`}
                  aria-label={`Navigate to ${item.title}`}
                >
                  {item.title}
                </SEOLink>
              </h4>
              
              {item.description && (
                <p className="related-description text-gray-600 text-sm line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
})

// Navigation breadcrumb with internal linking
export const NavigationSEO = memo(({ 
  currentPage,
  category 
}: { 
  currentPage: string
  category?: string
}) => {
  const navigationItems = [
    { name: 'Home', url: '/' },
    { name: 'Tours', url: '/tours' },
    { name: 'Gallery', url: '/gallery' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' }
  ]

  return (
    <nav className="navigation-seo" aria-label="Main navigation">
      <ul className="nav-list flex flex-wrap justify-center space-x-6 mb-8">
        {navigationItems.map((item) => (
          <li key={item.name} className="nav-item">
            <SEOLink
              href={item.url}
              className={`nav-link px-4 py-2 rounded-lg transition-colors ${
                currentPage === item.name.toLowerCase() 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
              }`}
              aria-label={`Navigate to ${item.name} page`}
              title={`Visit our ${item.name} page`}
            >
              {item.name}
            </SEOLink>
          </li>
        ))}
      </ul>
    </nav>
  )
})

// Footer with internal linking
export const FooterSEO = memo(() => {
  const footerLinks = {
    'Tours': [
      { name: 'Desert Safari', url: '/tours/desert-safari' },
      { name: 'Cultural Heritage', url: '/tours/cultural-heritage' },
      { name: 'Springs Tour', url: '/tours/springs-tour' },
      { name: 'Overnight Camping', url: '/tours/overnight-camping' }
    ],
    'Destinations': [
      { name: 'Cleopatra Bath', url: '/destinations/cleopatra-bath' },
      { name: 'Temple of Oracle', url: '/destinations/temple-oracle' },
      { name: 'Great Sand Sea', url: '/destinations/great-sand-sea' },
      { name: 'Salt Lakes', url: '/destinations/salt-lakes' }
    ],
    'Information': [
      { name: 'Travel Guide', url: '/guide' },
      { name: 'Best Time to Visit', url: '/guide/best-time' },
      { name: 'What to Pack', url: '/guide/packing' },
      { name: 'Safety Tips', url: '/guide/safety' }
    ],
    'Company': [
      { name: 'About Us', url: '/about' },
      { name: 'Our Team', url: '/about/team' },
      { name: 'Sustainability', url: '/about/sustainability' },
      { name: 'Reviews', url: '/reviews' }
    ]
  }

  return (
    <footer className="footer-seo bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-section">
              <h3 className="footer-title text-lg font-semibold mb-4 text-primary">
                {category}
              </h3>
              <ul className="footer-links space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <SEOLink
                      href={link.url}
                      className="footer-link text-gray-300 hover:text-white transition-colors"
                      title={`Learn more about ${link.name}`}
                    >
                      {link.name}
                    </SEOLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-bottom border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="copyright text-gray-400">
            © 2024 Siwa With Us. All rights reserved. 
            <SEOLink href="/privacy" className="ml-2 hover:text-white">
              Privacy Policy
            </SEOLink>
            <SEOLink href="/terms" className="ml-2 hover:text-white">
              Terms of Service
            </SEOLink>
          </p>
        </div>
      </div>
    </footer>
  )
})

SEOLink.displayName = 'SEOLink'
RelatedContentSEO.displayName = 'RelatedContentSEO'
NavigationSEO.displayName = 'NavigationSEO'
FooterSEO.displayName = 'FooterSEO'