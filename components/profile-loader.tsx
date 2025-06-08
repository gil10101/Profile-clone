"use client"

import { useState, useEffect } from "react"

interface LoaderProps {
  onLoadComplete?: () => void
  message?: string
  loadTime?: number
}

export default function SoulwireLoader({ onLoadComplete, message = "Loading...", loadTime = 800 }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Create blocks for progress bar
  const totalBlocks = 20
  const filledBlocks = Math.floor((progress / 100) * totalBlocks)
  
  // Ensure mount status is set to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted) return
    
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / loadTime) * 100, 100)
      setProgress(newProgress)
      
      if (newProgress >= 100) {
        clearInterval(interval)
        setIsLoading(false)
        if (onLoadComplete) onLoadComplete()
      }
    }, 16) // Update at ~60fps
    
    return () => clearInterval(interval)
  }, [loadTime, onLoadComplete, mounted])
  
  if (!mounted || !isLoading) return null
  
  return (
    <div className="loader-component">
      <div className="instruction">{message}</div>
      
      <div className="progress">
        <div className="before"></div>
        
        {Array.from({ length: totalBlocks }).map((_, index) => (
          <div 
            key={index} 
            className={`block ${index < filledBlocks ? 'solid' : 'empty'} ${index === filledBlocks - 1 && progress < 100 ? 'pulse' : ''}`}
          ></div>
        ))}
        
        <div className="after"></div>
      </div>
    </div>
  )
} 