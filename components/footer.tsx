import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-8 border-t border-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-500 mb-4 md:mb-0">
          © {new Date().getFullYear()} Soulwire. All rights reserved.
        </div>

        <div className="flex space-x-6">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={20} className="text-gray-500 hover:text-white transition-colors" />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter size={20} className="text-gray-500 hover:text-white transition-colors" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={20} className="text-gray-500 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

