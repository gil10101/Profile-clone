import { useEffect, useState } from 'react';

interface LoadingBarProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function LoadingBar({ isLoading, onLoadingComplete }: LoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    let startTime = Date.now();
    const duration = 2000; // 2 seconds for loading animation

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        onLoadingComplete?.();
      }
    };

    requestAnimationFrame(animate);

    return () => {
      setProgress(0);
    };
  }, [isLoading, onLoadingComplete]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64">
      <div className="h-[2px] bg-gray-800">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 