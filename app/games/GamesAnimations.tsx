'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function GamesAnimations() {
  useGSAP(() => {
    // Page heading fade + slide up on load
    gsap.from('h1, h1 + p', {
      opacity: 0,
      y: 32,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      immediateRender: false,
    })

    // Sort button area fade in on load
    gsap.from('.flex.items-center.gap-px', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2,
      immediateRender: false,
    })

    // Game grid cards stagger reveal using ScrollTrigger.batch
    ScrollTrigger.batch('.grid-standard > *, .grid-poki > *', {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.06,
          immediateRender: false,
        })
      },
      start: 'top 90%',
      once: true,
    })

    // Pagination fade in
    gsap.from('.games-pagination', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.games-pagination',
        start: 'top 95%',
        once: true,
      },
    })
  })

  return null
}
