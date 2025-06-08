"use client"

import { useState, useEffect, useRef } from "react"
import { 
  parseHTML, 
  wrapInSpan, 
  getRandomChar, 
  Easing,
  shuffle 
} from "@/lib/profile-utils"

interface EnhancedTextScrambleProps {
  text: string
  delay?: number
  duration?: number
  className?: string
  onComplete?: () => void
  mode?: 'decode' | 'type'
  scrambleChars?: string
  useInput?: boolean
  showPower?: number
  mashPower?: number
  donePower?: number
  cursor?: string
  ease?: (t: number) => number
}

export default function Enhanced({ 
  text, 
  delay = 0, 
  duration = 2,
  className = "",
  onComplete,
  mode = 'decode',
  scrambleChars = "▒░█▓▒░█▓",
  useInput = true,
  showPower = 0.5,
  mashPower = 2,
  donePower = 15,
  cursor = '_',
  ease = Easing.Quint.inOut
}: EnhancedTextScrambleProps) {
  const [displayHtml, setDisplayHtml] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const progressRef = useRef(0)
  const requestRef = useRef<number | null>(null)
  const timeStartRef = useRef<number | null>(null)
  const parsedContentRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure mount status is set to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Parse the HTML content
    parsedContentRef.current = parseHTML(text)
    
    // Create scramble characters
    let scrambleSet = scrambleChars
    
    if (useInput && mode === 'decode') {
      // Add actual characters from the content to the scramble set
      const contentChars = parsedContentRef.current.queue.map((item: any) => item.char.toLowerCase())
        .reduce((acc: string, char: string) => 
          acc.indexOf(char) === -1 ? acc + char : acc, "")
      
      scrambleSet += contentChars
    }

    // Shuffle the queue for random reveal order
    if (mode === 'decode') {
      shuffle(parsedContentRef.current.queue)
    }

    // Start animation after delay
    let timeout = setTimeout(() => {
      progressRef.current = 0
      timeStartRef.current = performance.now()
      
      // For 'decode' mode, start with random characters
      if (mode === 'decode') {
        const startContent = [...parsedContentRef.current.start]
        setDisplayHtml(startContent.join(''))
      }
      
      // Start animation loop
      requestRef.current = requestAnimationFrame(animationStep)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [text, delay, duration, mode, useInput, scrambleChars, mounted])

  const animationStep = (timestamp: number) => {
    if (!timeStartRef.current) {
      timeStartRef.current = timestamp
    }
    
    const elapsed = timestamp - timeStartRef.current
    const durationMs = duration * 1000
    let progress = Math.min(1, elapsed / durationMs)
    
    // Apply easing function
    progress = ease(progress)
    progressRef.current = progress
    
    // Process animation frame based on mode
    if (mode === 'decode') {
      // Decode mode - gradual reveal with scrambled characters
      const content = parsedContentRef.current
      const result = [...content.start]
      
      // Calculate reveal indices based on powers
      const showCount = Math.floor(Math.pow(progress, showPower) * content.queue.length)
      const mashCount = Math.floor(Math.pow(progress, mashPower) * content.queue.length)
      const doneCount = Math.floor(Math.pow(progress, donePower) * content.queue.length)
      
      // Process each character
      for (let i = 0; i < showCount; i++) {
        const item = content.queue[i]
        let char
        
        if (i <= doneCount) {
          // Completely revealed
          char = item.char
        } else if (i <= mashCount) {
          // Partially revealed (still changing)
          if (!item.temp || Math.random() < 0.15) {
            item.temp = getRandomChar(scrambleChars)
          }
          char = item.temp
        } else {
          // Not revealed yet
          char = wrapInSpan(getRandomChar(scrambleChars))
        }
        
        result[item.index] = char
      }
      
      setDisplayHtml(result.join(''))
    } else {
      // Type mode - sequential typing with cursor
      const content = parsedContentRef.current
      const textLength = content.text.length
      const index = Math.min(textLength, Math.floor(progress * (textLength + 1)))
      
      // Get typed portion of text
      const typed = text.substring(0, index)
      
      // Add cursor if not complete
      const withCursor = progress < 1 ? typed + cursor : typed
      
      setDisplayHtml(withCursor)
    }
    
    // Check if animation is complete
    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animationStep)
    } else {
      setIsComplete(true)
      setDisplayHtml(mode === 'type' ? text : text)
      if (onComplete) onComplete()
    }
  }

  if (!mounted) {
    return <span className={`typer-component ${className}`}>{text}</span>
  }

  return (
    <span 
      className={`typer-component ${isComplete ? '' : 'temp'} ${className}`}
      dangerouslySetInnerHTML={{ __html: displayHtml }}
    />
  )
} 