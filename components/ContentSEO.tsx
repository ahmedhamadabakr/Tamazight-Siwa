import { memo, ReactNode } from 'react'

interface ArticleSEOProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  category?: string
  tags?: string[]
  readingTime?: number
  wordCount?: number
  children: ReactNode
}

// Article component with SEO optimization
export const ArticleSEO = memo(({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  category = 'Travel',
  tags = [],
  readingTime,
  wordCount,
  children
}: ArticleSEOProps) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Siwa With Us",
      "logo": {
        "@type": "ImageObject",
        "url": "https://siwa-with-us.com/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "articleSection": category,
    "keywords": tags.join(', '),
    ...(readingTime && {
      "timeRequired": `PT${readingTime}M`
    }),
    ...(wordCount && { "wordCount": wordCount }),
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  }

  return (
    <article className="content-seo-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Article Header */}
      <header className="article-header mb-8">
        <h1 className="article-title text-4xl font-bold mb-4">{title}</h1>
        <div className="article-meta text-gray-600 mb-4">
          <span className="author">By {author}</span>
          <span className="separator mx-2">•</span>
          <time dateTime={datePublished} className="published-date">
            {new Date(datePublished).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {readingTime && (
            <>
              <span className="separator mx-2">•</span>
              <span className="reading-time">{readingTime} min read</span>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className="article-tags">
            {tags.map(tag => (
              <span key={tag} className="tag bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mr-2">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="article-content prose prose-lg max-w-none">
        {children}
      </div>
    </article>
  )
})

// FAQ component with SEO optimization
export const FAQSectionSEO = memo(({ 
  faqs,
  title = "Frequently Asked Questions"
}: { 
  faqs: Array<{ question: string; answer: string }>
  title?: string
}) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": title,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <section className="faq-section-seo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <h2 className="faq-title text-3xl font-bold mb-8">{title}</h2>
      
      <div className="faq-list space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item border-b border-gray-200 pb-6">
            <h3 className="faq-question text-xl font-semibold mb-3 text-primary">
              {faq.question}
            </h3>
            <div className="faq-answer text-gray-700 leading-relaxed">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})

// Breadcrumb component with SEO
export const BreadcrumbSEO = memo(({ 
  items 
}: { 
  items: Array<{ name: string; url: string }> 
}) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <nav className="breadcrumb-seo" aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <ol className="breadcrumb-list flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index > 0 && <span className="separator mx-2">/</span>}
            {index === items.length - 1 ? (
              <span className="current text-primary font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a 
                href={item.url} 
                className="link hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
})

// Review/Rating component with SEO
export const ReviewSectionSEO = memo(({ 
  reviews,
  overallRating,
  totalReviews
}: { 
  reviews: Array<{
    author: string
    rating: number
    text: string
    date: string
    title?: string
  }>
  overallRating: number
  totalReviews: number
}) => {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Siwa Oasis Tours",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": overallRating,
      "reviewCount": totalReviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.text,
      "datePublished": review.date,
      ...(review.title && { "name": review.title })
    }))
  }

  return (
    <section className="review-section-seo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      
      <div className="reviews-header mb-8">
        <h2 className="reviews-title text-3xl font-bold mb-4">Customer Reviews</h2>
        <div className="overall-rating flex items-center mb-4">
          <div className="rating-stars flex mr-3">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.floor(overallRating) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text text-lg font-semibold">
            {overallRating} out of 5 ({totalReviews} reviews)
          </span>
        </div>
      </div>

      <div className="reviews-list space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="review-item bg-gray-50 p-6 rounded-lg">
            {review.title && (
              <h3 className="review-title font-semibold mb-2">{review.title}</h3>
            )}
            <div className="review-header flex items-center mb-3">
              <div className="review-rating flex mr-3">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="review-author font-medium">{review.author}</span>
              <span className="review-date text-gray-500 ml-auto">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="review-text text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
})

ArticleSEO.displayName = 'ArticleSEO'
FAQSectionSEO.displayName = 'FAQSectionSEO'
BreadcrumbSEO.displayName = 'BreadcrumbSEO'
ReviewSectionSEO.displayName = 'ReviewSectionSEO'