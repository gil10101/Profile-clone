"use client"

import { useState, useEffect } from "react"

interface TextScrambleProps {
  text: string
  delay?: number
  duration?: number
}

export function TextScramble({ text, delay = 0, duration = 2000 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const chars = "▒░█▓▒░█▓"

  const getRandomChar = () => {
    return chars[Math.floor(Math.random() * chars.length)]
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout
    let startTime: number

    // Initial delay
    timeout = setTimeout(() => {
      // Generate initial random text but preserve whitespace
      setDisplayText(
        text
          .split("")
          .map(char => {
            if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
              return char; // Preserve whitespace
            }
            return getRandomChar();
          })
          .join(""),
      )

      startTime = Date.now()

      // Start the animation
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Update the text with a mix of random chars and actual chars
        const newText = text
          .split("")
          .map((char, i) => {
            // Preserve whitespace characters
            if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
              return char;
            }
            
            // Determine if this character should be revealed based on progress
            const shouldReveal = Math.random() < progress * 2 || progress > 0.9
            return shouldReveal ? char : getRandomChar()
          })
          .join("")

        setDisplayText(newText)

        if (progress >= 1) {
          clearInterval(interval)
          setDisplayText(text)
          setIsComplete(true)
        }
      }, 50)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, delay, duration])

  return (
    <span 
      className={`inline-block transition-opacity duration-300 ${isComplete ? "opacity-100" : "opacity-70"}`}
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

