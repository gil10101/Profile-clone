"use client"

import { useState, useEffect, useRef } from "react"
import { Easing } from "@/lib/profile-utils"

interface TransitionProps {
  className?: string
  visible?: boolean
  duration?: number
  onComplete?: () => void
  mode?: 'obscure' | 'reveal'
  flipX?: boolean
  flipY?: boolean
  color?: string
  ease?: (t: number) => number
}

export default function Transition({
  className = "",
  visible = false,
  duration = 0.5,
  onComplete,
  mode = 'obscure',
  flipX = false,
  flipY = false,
  color = "#16191b",
  ease = Easing.Quint.out
}: TransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [progress, setProgress] = useState(0)
  const requestRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mounted, setMounted] = useState(false)
  const rafRef = useRef<number | null>(null)

  // Initialize canvas on mount
  useEffect(() => {
    setMounted(true)
    
    if (!canvasRef.current) return
    
    // Setup canvas with performance optimizations
    const canvas = canvasRef.current
    contextRef.current = canvas.getContext('2d', { alpha: false })
    
    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      
      resizeTimeout = setTimeout(() => {
        if (!canvasRef.current || !contextRef.current) return
        
        const scale = window.devicePixelRatio || 1
        
        // Set display size
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        setDimensions({ width, height })
        
        // Set actual size in memory (scaled for high DPI)
        canvas.width = width * scale
        canvas.height = height * scale
        
        // Scale rendering to device
        contextRef.current.scale(scale, scale)
      }, 100) // Debounce resize events
    }
    
    // Initial sizing
    handleResize()
    
    // Listen for resize events
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Handle animation
  useEffect(() => {
    if (!mounted || !contextRef.current || !canvasRef.current) return
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }
      
      const elapsed = currentTime - startTimeRef.current
      const newProgress = Math.min(elapsed / (duration * 1000), 1)
      
      setProgress(newProgress)
      
      if (newProgress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else if (onComplete) {
        onComplete()
      }
    }
    
    if (visible) {
      rafRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [visible, duration, onComplete, mounted])

  // Render the transition effect
  const renderTransition = (progress: number) => {
    if (!contextRef.current || !canvasRef.current) return
    
    const ctx = contextRef.current
    const width = dimensions.width
    const height = dimensions.height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Transition parameters
    const curvePower = 0.85
    const curveOffset = 0.95
    const curvePower2 = 3
    const curveOffset2 = 0.95
    const opacity = 0.5
    
    // Calculate curve points based on progress
    const p1 = Math.pow(progress, curvePower)
    const p2 = Math.pow(progress, curvePower + curveOffset)
    const p3 = Math.pow(progress, curvePower + curvePower2)
    const p4 = Math.pow(progress, curvePower + curvePower2 + curveOffset2)
    
    // Y positions for the curve
    const y1 = height - p1 * height
    const y2 = height - p2 * height
    const y3 = height - p3 * height
    const y4 = height - p4 * height
    
    // X positions based on flip direction
    const x1 = flipX ? width : 0
    const x2 = flipX ? 0 : width
    
    // Apply vertical flip if needed
    if (flipY) {
      ctx.save()
      ctx.translate(0, height)
      ctx.scale(1, -1)
    }
    
    // Set fill style
    ctx.fillStyle = color
    
    // Draw based on mode
    if (mode === 'obscure') {
      // Partially transparent part
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineTo(x2, y4)
      ctx.lineTo(x1, y3)
      ctx.fill()
      
      // Fully opaque part
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.moveTo(x1, y3)
      ctx.lineTo(x2, y4)
      ctx.lineTo(x2, height)
      ctx.lineTo(x1, height)
      ctx.fill()
    } else {
      // Reveal mode - invert the pattern
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.moveTo(x1, 0)
      ctx.lineTo(x2, 0)
      ctx.lineTo(x2, y2)
      ctx.lineTo(x1, y1)
      ctx.fill()
      
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineTo(x2, y4)
      ctx.lineTo(x1, y3)
      ctx.fill()
    }
    
    // Restore if flipped
    if (flipY) {
      ctx.restore()
    }
  }

  if (!mounted) return null

  return (
    <div className={`transition-component ${className} ${visible ? 'visible' : 'hidden'}`}>
      <canvas 
        ref={canvasRef} 
        className="canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
} 