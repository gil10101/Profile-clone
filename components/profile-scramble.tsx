"use client"

import { useState, useEffect } from "react"

interface TextScrambleProps {
  text: string
  delay?: number
  duration?: number
  className?: string
  onComplete?: () => void
  scrambleChars?: string
  mutationRate?: number
  showPower?: number
  mashPower?: number
  donePower?: number
}

export default function Scramble({ 
  text, 
  delay = 0, 
  duration = 800,
  className = "",
  onComplete,
  scrambleChars = "▒░█▓▒░█▓",
  mutationRate = 0.15,
  showPower = 0.5,
  mashPower = 2,
  donePower = 15
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(() => {
    // Initialize with scrambled text but preserve whitespace structure
    return text.split("").map(char => {
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        return char; // Preserve whitespace
      }
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }).join("");
  })
  const [isComplete, setIsComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure mount status is set to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    let interval: NodeJS.Timeout
    let startTime: number

    // Start immediately without delay
    startTime = Date.now()

    // Start the animation
    interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Calculate different power levels for different stages of the animation
      const showProgress = Math.pow(progress, showPower)
      const mashProgress = Math.pow(progress, mashPower)
      const doneProgress = Math.pow(progress, donePower)

      // Update the text with a mix of random chars and actual chars
      const newText = text
        .split("")
        .map((char, i) => {
          // Preserve whitespace characters
          if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
            return char;
          }
          
          const charProgress = i / text.length
          
          // Determine which stage of the animation we're in for this character
          if (charProgress <= doneProgress) {
            return char // Character is fully revealed
          } else if (charProgress <= mashProgress) {
            // Character is in the "mashing" phase
            return Math.random() < mutationRate 
              ? scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
              : char
          } else if (charProgress <= showProgress) {
            // Character is in the initial reveal phase
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          } else {
            // Character hasn't started animating yet
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          }
        })
        .join("")

      setDisplayText(newText)

      if (progress >= 1) {
        clearInterval(interval)
        setDisplayText(text)
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }, 50)

    return () => {
      clearInterval(interval)
    }
  }, [text, duration, onComplete, mounted, scrambleChars, mutationRate, showPower, mashPower, donePower])

  if (!mounted) {
    return <span className={`typer-component ${className}`}>{text}</span>
  }

  return (
    <span 
      className={`typer-component ${isComplete ? '' : 'temp'} ${className}`}
      style={{
        // Ensure consistent character spacing during animation
        fontVariantNumeric: 'tabular-nums',
        // Prevent layout shifts during scramble animation
        whiteSpace: 'pre-wrap',
        // Maintain consistent line height
        lineHeight: 'inherit'
      }}
    >
      {displayText}
    </span>
  )
} 