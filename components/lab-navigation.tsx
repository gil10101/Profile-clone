import { useState } from 'react';
import Link from 'next/link';

interface LabNavigationProps {
  labName: string;
  description?: string;
}

export function LabNavigation({ labName, description }: LabNavigationProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-20 relative">
        {/* Left side - Name and Description */}
        <div className="absolute left-0 h-full flex flex-col justify-center">
          <span className="text-white">{labName}</span>
          <div className="h-0 overflow-hidden transition-all duration-500"
               style={{ height: isHovered ? '20px' : '0' }}>
            {description && (
              <span className="text-gray-400 text-sm">{description}</span>
            )}
          </div>
        </div>

        {/* Right side - Three bars menu */}
        <div className="absolute right-0 h-full flex items-center overflow-hidden">
          <div 
            className="transition-all duration-500 ease-in-out"
            style={{ transform: isHovered ? 'translateX(200px)' : 'translateX(0)', opacity: isHovered ? 0 : 1 }}
          >
            <div className="space-y-2 cursor-pointer">
              <div className="w-8 h-[1px] bg-white"></div>
              <div className="w-8 h-[1px] bg-white"></div>
              <div className="w-8 h-[1px] bg-white"></div>
            </div>
          </div>
        </div>

        {/* Right side HOME and nav arrows - slides in from bottom on hover */}
        <div 
          className="absolute right-0 h-full flex items-center space-x-6 transition-all duration-500 ease-in-out overflow-hidden"
          style={{ 
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: isHovered ? 1 : 0
          }}
        >
          <button className="text-white hover:text-gray-300 transition-colors text-lg">←</button>
          <Link href="/" className="text-white hover:text-gray-300 transition-colors">
            HOME
          </Link>
          <button className="text-white hover:text-gray-300 transition-colors text-lg">→</button>
        </div>
      </div>
    </div>
  );
} 