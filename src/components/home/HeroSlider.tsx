'use client'

import { useEffect, useRef, useState } from 'react'
import type { HeroSlide } from '@/payload-types'
import { MediaImage } from './MediaImage'

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 3000)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  function move(direction: number) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

  if (!slides.length) {
    return (
      <section className="hero hero-empty" aria-label="Hero">
        <div className="container"><div className="empty-state">Hero slides can be added from the CMS.</div></div>
      </section>
    )
  }

  return (
    <section className="hero" aria-label="Featured clinic information" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null }} onTouchEnd={(event) => {
      if (touchStart.current === null) return
      const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current
      if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1)
      touchStart.current = null
    }}>
      <div className="hero-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <article className="hero-slide" id={`slide-${index + 1}`} key={slide.id} aria-hidden={activeSlide !== index} aria-label={`Slide ${index + 1} of ${slides.length}`}>
            <div className="container hero-grid">
              <div className="hero-copy">
                {slide.eyebrow ? <p className="eyebrow">{slide.eyebrow}</p> : null}
                {index === 0 ? <h1>{slide.heading}</h1> : <h2 className="hero-heading">{slide.heading}</h2>}
                <p>{slide.description}</p>
                {slide.ctaLabel && slide.ctaLink ? <a className="button" href={slide.ctaLink} tabIndex={activeSlide === index ? 0 : -1}>{slide.ctaLabel}</a> : null}
              </div>
              <MediaImage media={slide.image} className="hero-image" fallbackLabel={slide.heading} priority={index === 0} />
            </div>
          </article>
        ))}
      </div>
      {slides.length > 1 ? (
        <>
          <button className="slider-arrow slider-arrow-prev" type="button" onClick={() => move(-1)} aria-label="Previous slide">‹</button>
          <button className="slider-arrow slider-arrow-next" type="button" onClick={() => move(1)} aria-label="Next slide">›</button>
          <div className="slider-dots" aria-label="Choose a slide">
            {slides.map((slide, index) => <button className={activeSlide === index ? 'active' : ''} type="button" onClick={() => setActiveSlide(index)} key={slide.id} aria-label={`Go to slide ${index + 1}`} aria-current={activeSlide === index ? 'true' : undefined} />)}
          </div>
        </>
      ) : null}
    </section>
  )
}
