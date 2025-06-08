import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
  link: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-900 transition-all hover:shadow-xl">
      <div className="aspect-video overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={600}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-medium">{project.title}</h3>
        <p className="mt-2 text-sm text-gray-400">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag, index) => (
            <span key={index} className="inline-block rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-400">
              {tag}
            </span>
          ))}
        </div>

        <Link href={project.link} className="mt-4 inline-flex items-center text-sm text-white hover:text-gray-300">
          View Project <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  )
}

