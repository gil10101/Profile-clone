"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import Loader from "@/components/profile-loader"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load components
const Typer = dynamic(() => import('@/components/profile-typer'), { ssr: false })
const Scramble = dynamic(() => import('@/components/profile-scramble'), { ssr: false })
const Transition = dynamic(() => import('@/components/profile-transition'), { ssr: false })

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState("Hello")
  const [typedGreeting, setTypedGreeting] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const greetings = [
    "Hello", // English
    "Hola", // Spanish
    "Bonjour", // French
    "Ciao", // Italian
    "Konnichiwa", // Japanese
    "Annyeong", // Korean
    "Ni Hao", // Chinese
    "Namaste", // Hindi
    "Merhaba", // Turkish
    "Zdravstvuyte", // Russian
    "Salaam", // Arabic
    "Sawubona", // Zulu
    "Hallo", // German
    "Ola", // Portuguese
    "Szia", // Hungarian
    "Hallo", // Dutch
    "Aloha", // Hawaiian
  ]

  const projects = [
    { id: "000", name: "Project 0", link: "/labs/project-0" },
    { id: "001", name: "Project 1", link: "/labs/project-1" },
    { id: "002", name: "Project 2", link: "/labs/project-2" },
    { id: "003", name: "Project 3", link: "/labs/project-3" },
    { id: "004", name: "Project 4", link: "/labs/project-4" },
    { id: "005", name: "Project 5", link: "/labs/project-5" },
    { id: "006", name: "Project 6", link: "/labs/project-6" },
    { id: "007", name: "Project 7", link: "/labs/project-7" },
    { id: "008", name: "Project 8", link: "/labs/project-8" },
    { id: "009", name: "Project 9", link: "/labs/project-9" },
    { id: "010", name: "Project 10", link: "/labs/project-10" },
    { id: "011", name: "Project 11", link: "/labs/project-11" },
    { id: "012", name: "Project 12", link: "/labs/project-12" },
    { id: "013", name: "Project 13", link: "/labs/project-13" },
    { id: "014", name: "Project 14", link: "/labs/project-14" },
    { id: "015", name: "Project 15", link: "/labs/project-15" },
    { id: "016", name: "Project 16", link: "/labs/project-16" },
    { id: "017", name: "Project 17", link: "/labs/project-17" },
    { id: "018", name: "Project 18", link: "/labs/project-18" },
    { id: "019", name: "Project 19", link: "/labs/project-19" },
    { id: "020", name: "Project 20", link: "/labs/project-20" },
  ]

  const skills = [
    { id: "000", name: "TypeScript" },
    { id: "001", name: "WebGL / Three.js" },
    { id: "002", name: "GLSL Shaders" },
    { id: "003", name: "Canvas API" },
    { id: "004", name: "React / Next.js" },
    { id: "005", name: "Node.js" },
    { id: "006", name: "Creative Coding" },
    { id: "007", name: "Generative Art" },
    { id: "008", name: "Animation" },
    { id: "009", name: "Interactive Design" },
    { id: "010", name: "Procedural Generation" },
    { id: "011", name: "Physics Simulation" },
    { id: "012", name: "Audio Visualization" },
    { id: "013", name: "Data Visualization" },
    { id: "014", name: "Algorithmic Art" },
    { id: "015", name: "Particle Systems" },
    { id: "016", name: "SVG Animation" },
    { id: "017", name: "WebAudio API" },
    { id: "018", name: "Responsive Design" },
    { id: "019", name: "Tailwind CSS" },
    { id: "020", name: "UI/UX Prototyping" },
  ]

  const contacts = [
    { id: "000", name: "Email", value: "hello@user.com" },
    { id: "001", name: "Twitter", value: "@user" },
    { id: "002", name: "GitHub", value: "github.com/user" },
    { id: "003", name: "LinkedIn", value: "linkedin.com/in/user" },
  ]

  // Split projects into three columns
  const column1 = projects.slice(0, 7)
  const column2 = projects.slice(7, 14)
  const column3 = projects.slice(14)

  // Split skills into three columns
  const skillsColumn1 = skills.slice(0, 7)
  const skillsColumn2 = skills.slice(7, 14)
  const skillsColumn3 = skills.slice(14)

  // Function to generate random characters
  const getRandomChar = () => {
    const chars = "-/\\>|<_=+*&^%$#@![]{}:;,.?"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  // Use useEffect to ensure this only runs on the client
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true)
    
    // Choose a random greeting on the client-side only
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
    setGreeting(randomGreeting)

    // Set initialization time to 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowContent(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleTyperComplete = () => {
    setIsLoading(false)
    setShowContent(true)
  }

  // Don't render content at all until client-side
  if (!isClient) return null;

  return (
    <main className="min-h-screen flex flex-col font-mono text-gray-300 bg-[#111111]">
      {isLoading && <Loader message="Initializing interface..." loadTime={800} />}
      
      {/* Single transition effect for better performance */}
      <Transition 
        visible={showContent} 
        mode="reveal" 
        duration={0.02} 
        color="#111111"
        flipX={true}
      />
      
      <div className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center transition-all duration-300 ${showContent ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`} ref={contentRef}>
        <div className="flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl mb-8 sm:mb-12 self-center">
            <Suspense fallback={<div className="loading-text">Loading...</div>}>
              {<Typer text={greeting} onComplete={handleTyperComplete} />}
            </Suspense>
          </h1>
          
          {/* Info section with reduced delay */}
          <div className={`w-full grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] gap-x-2 mb-12 sm:mb-16 transition-all duration-300 delay-25 ${showContent ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <div className="text-gray-500 uppercase text-xs sm:text-sm">INFO</div>
            <div>
              {isLoading ? (
                <div className="loading-text">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-1">
                        {Array(40)
                          .fill(0)
                          .map((_, j) => getRandomChar())
                          .join("")}
                      </div>
                    ))}
                </div>
              ) : (
                <div>
                  {showContent && (
                    <Suspense fallback={<div className="loading-text">Loading...</div>}>
                      <Scramble 
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                        delay={0}
                        duration={1200}
                      />
                    </Suspense>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={`w-full grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] gap-x-2 mb-12 sm:mb-16 transition-all duration-300 delay-100 ${showContent ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <div className="text-gray-500 uppercase text-xs sm:text-sm">LABS</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8">
              <div>
                {column1.map((project) => (
                  <div key={project.id} className="mb-1 sm:mb-1">
                    <Link href={project.link} className="project-link group block py-1 sm:py-0">
                      <div className="inline-flex items-baseline">
                        <span className="index">
                          {project.id}
                        </span><span className="mr-2"></span>
                        <span className="title">
                          {isLoading ? (
                            Array(project.name.length)
                              .fill(0)
                              .map((_, i) => getRandomChar())
                              .join("")
                          ) : (
                            <Scramble 
                              text={project.name} 
                              delay={200 + parseInt(project.id) * 20}
                              duration={1000}
                            />
                          )}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div>
                {column2.map((project) => (
                  <div key={project.id} className="mb-1 sm:mb-1">
                    <Link href={project.link} className="project-link group block py-1 sm:py-0">
                      <div className="inline-flex items-baseline">
                        <span className="index">
                          {project.id}
                        </span><span className="mr-2"></span>
                        <span className="title">
                          {isLoading ? (
                            Array(project.name.length)
                              .fill(0)
                              .map((_, i) => getRandomChar())
                              .join("")
                          ) : (
                            <Scramble 
                              text={project.name} 
                              delay={400 + parseInt(project.id) * 20}
                              duration={1000}
                            />
                          )}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div>
                {column3.map((project) => (
                  <div key={project.id} className="mb-1 sm:mb-1">
                    <Link href={project.link} className="project-link group block py-1 sm:py-0">
                      <div className="inline-flex items-baseline">
                        <span className="index">
                          {project.id}
                        </span><span className="mr-2"></span>
                        <span className="title">
                          {isLoading ? (
                            Array(project.name.length)
                              .fill(0)
                              .map((_, i) => getRandomChar())
                              .join("")
                          ) : (
                            <Scramble 
                              text={project.name} 
                              delay={600 + parseInt(project.id) * 20}
                              duration={1000}
                            />
                          )}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`w-full grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] gap-x-2 mb-12 sm:mb-16 transition-all duration-300 delay-150 ${showContent ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <div className="text-gray-500 uppercase text-xs sm:text-sm">SKILLS</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8">
              <div>
                {skillsColumn1.map((skill) => (
                  <div key={skill.id} className="mb-1 sm:mb-1">
                    <div className="inline-flex items-baseline py-1 sm:py-0">
                      <span className="text-gray-500 relative">
                        {skill.id}
                        <span className="absolute -bottom-px left-0 w-full h-px bg-gray-700"></span>
                      </span><span className="mr-2"></span>
                      <span className="relative">
                        {isLoading ? (
                          Array(skill.name.length)
                            .fill(0)
                            .map((_, i) => getRandomChar())
                            .join("")
                        ) : (
                          <Scramble 
                            text={skill.name} 
                            delay={1000 + parseInt(skill.id) * 15}
                            duration={800}
                          />
                        )}
                        <span className="absolute -bottom-px left-0 w-0 h-px bg-white"></span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {skillsColumn2.map((skill) => (
                  <div key={skill.id} className="mb-1 sm:mb-1">
                    <div className="inline-flex items-baseline py-1 sm:py-0">
                      <span className="text-gray-500 relative">
                        {skill.id}
                        <span className="absolute -bottom-px left-0 w-full h-px bg-gray-700"></span>
                      </span><span className="mr-2"></span>
                      <span className="relative">
                        {isLoading ? (
                          Array(skill.name.length)
                            .fill(0)
                            .map((_, i) => getRandomChar())
                            .join("")
                        ) : (
                          <Scramble 
                            text={skill.name} 
                            delay={1200 + parseInt(skill.id) * 15}
                            duration={800}
                          />
                        )}
                        <span className="absolute -bottom-px left-0 w-0 h-px bg-white"></span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {skillsColumn3.map((skill) => (
                  <div key={skill.id} className="mb-1 sm:mb-1">
                    <div className="inline-flex items-baseline py-1 sm:py-0">
                      <span className="text-gray-500 relative">
                        {skill.id}
                        <span className="absolute -bottom-px left-0 w-full h-px bg-gray-700"></span>
                      </span><span className="mr-2"></span>
                      <span className="relative">
                        {isLoading ? (
                          Array(skill.name.length)
                            .fill(0)
                            .map((_, i) => getRandomChar())
                            .join("")
                        ) : (
                          <Scramble 
                            text={skill.name} 
                            delay={1400 + parseInt(skill.id) * 15}
                            duration={800}
                          />
                        )}
                        <span className="absolute -bottom-px left-0 w-0 h-px bg-white"></span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`w-full grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] gap-x-2 mb-8 sm:mb-16 transition-all duration-300 delay-200 ${showContent ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            <div className="text-gray-500 uppercase text-xs sm:text-sm">CONTACT</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8">
              {contacts.map((contact) => (
                <div key={contact.id} className="mb-1 sm:mb-1">
                  <div className="inline-flex items-baseline py-1 sm:py-0">
                    <span className="text-gray-500 relative">
                      {contact.name}
                      <span className="absolute -bottom-px left-0 w-full h-px bg-gray-700"></span>
                    </span><span className="mr-2"></span>
                    <span className="relative">
                      {isLoading ? (
                        Array(contact.value.length)
                          .fill(0)
                          .map((_, i) => getRandomChar())
                          .join("")
                      ) : (
                        <Scramble 
                          text={contact.value} 
                          delay={1600 + parseInt(contact.id) * 20}
                          duration={1000}
                        />
                      )}
                      <span className="absolute -bottom-px left-0 w-0 h-px bg-white"></span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

