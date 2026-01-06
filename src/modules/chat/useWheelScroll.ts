import { useEffect, useRef, useCallback } from 'react'

interface WheelScrollOptions {
  speed?: number
  smooth?: boolean
}

export function useWheelScroll(containerRef: React.RefObject<HTMLElement>, options: WheelScrollOptions = {}) {
  const { speed = 50, smooth = true } = options
  
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: e.deltaY * speed / 100,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }, [containerRef, speed, smooth])
  
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false })
      return () => el.removeEventListener('wheel', handleWheel)
    }
  }, [containerRef, handleWheel])
}