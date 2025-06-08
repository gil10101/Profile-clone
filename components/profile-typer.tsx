"use client"

import { useState, useEffect } from "react"

interface TyperProps {
  text: string
  delay?: number
  onComplete?: () => void
  loop?: boolean
  className?: string
}

export default function Typer({ 
  text, 
  delay = 0, 
  onComplete, 
  loop = false, 
  className = "" 
}: TyperProps) {
  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isDone, setIsDone] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const chars = "-/\\>|<_=+*&^%$#@![]{}:;,.?"
  
  const getRandomChar = () => {
    return chars[Math.floor(Math.random() * chars.length)]
  }
  
  // Ensure mount status is set to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted) return
    
    let timeout: NodeJS.Timeout
    let typingInterval: NodeJS.Timeout
    let typingIndex = 0
    let blinkCount = 0
    let blinkInterval: NodeJS.Timeout
    
    // Handle delay before starting
    timeout = setTimeout(() => {
      // Start typing
      typingInterval = setInterval(() => {
        if (typingIndex <= text.length) {
          setDisplayText(text.substring(0, typingIndex))
          typingIndex++
        } else {
          clearInterval(typingInterval)
          
          // Start cursor blinking when typing is complete
          blinkInterval = setInterval(() => {
            setCursorVisible(prev => !prev)
            blinkCount++
            
            if (blinkCount > 6) {
              clearInterval(blinkInterval)
              setCursorVisible(false)
              setIsDone(true)
              if (onComplete) onComplete()
              
              // Reset and loop if loop is true
              if (loop) {
                typingIndex = 0
                blinkCount = 0
                setTimeout(() => {
                  setDisplayText("")
                  setCursorVisible(true)
                  setIsDone(false)
                  
                  typingInterval = setInterval(() => {
                    if (typingIndex <= text.length) {
                      setDisplayText(text.substring(0, typingIndex))
                      typingIndex++
                    } else {
                      clearInterval(typingInterval)
                    }
                  }, 150)
                }, 2000)
              }
            }
          }, 500)
        }
      }, 150)
    }, delay)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(typingInterval)
      clearInterval(blinkInterval)
    }
  }, [text, delay, onComplete, loop, mounted])
  
  if (!mounted) return null
  
  return (
    <div className={`greeting-component ${isDone ? 'done' : ''} ${className}`}>
      <div className="text">{displayText}</div>
      {cursorVisible && <div className="cursor"></div>}
    </div>
  )
} 