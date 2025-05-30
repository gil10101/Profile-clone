"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingBar } from "@/components/ui/loading-bar"
import { LabNavigation } from "@/components/lab-navigation"

export default function ProjectPage() {
  const params = useParams()
  const { slug } = params
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Map slug to project name and description
  const projectMap: Record<string, { name: string; description: string }> = {
    "primordial-soup": {
      name: "Primordial Soup",
      description: "An experiment in artificial life and evolution simulation",
    },
    "tensor-field": {
      name: "Tensor Field",
      description: "Visualizing tensor fields and vector flow patterns",
    },
    "neuro-synth": {
      name: "Neuro Synth",
      description: "A neural network-based audio synthesizer experiment",
    },
    "recursion-toy": {
      name: "Recursion Toy",
      description: "Interactive visualization of recursive patterns",
    },
    "magic-beans": {
      name: "Magic Beans",
      description: "Particle system simulation with organic behavior",
    },
    "kinetic-canvas": {
      name: "Kinetic Canvas",
      description: "Dynamic drawing and animation experiments",
    },
    "math-for-motion": {
      name: "Math for Motion",
      description: "Mathematical principles applied to motion graphics",
    },
    tentacles: {
      name: "Tentacles",
      description: "An attempt at simulating natural looking tentacles using the 2D canvas as a rendering context.",
    },
    // ... Add descriptions for other projects
  }

  const project = projectMap[slug as string] || { name: "Project", description: "An interactive experiment" }

  useEffect(() => {
    // Reset states when slug changes
    setIsLoading(true)
    setShowContent(false)
  }, [slug])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Add a small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100)
  }

  return (
    <>
      <LoadingBar isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />
      
      <main
        className={`min-h-screen p-8 md:p-16 lg:p-24 font-mono text-gray-300 transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="aspect-video bg-black/50 flex items-center justify-center border border-gray-800">
          <div className="text-center">
            <div className="text-xl mb-4">{project.name}</div>
            <div className="text-gray-500">Interactive content would be displayed here</div>
          </div>
        </div>
      </main>

      <LabNavigation labName={project.name} description={project.description} />
    </>
  )
}

