// src/components/TitleBar.tsx
import { Minus, Square, X, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isElectron, setIsElectron] = useState(false);
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    setIsElectron(!!window.electronAPI);
    
    if (window.electronAPI) {
      // Check initial maximized state
      window.electronAPI.windowIsMaximized().then(setIsMaximized);
      // Get platform
      window.electronAPI.getPlatform().then(setPlatform);
    }
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.windowMinimize();
  };

  const handleMaximize = () => {
    window.electronAPI?.windowMaximize().then(() => {
      window.electronAPI?.windowIsMaximized().then(setIsMaximized);
    });
  };

  const handleClose = () => {
    window.electronAPI?.windowClose();
  };

  if (!isElectron) return null;

  const isMac = platform === 'darwin';

  return (
    <div 
      className="h-10 bg-sidebar border-b border-border flex items-center select-none flex-shrink-0 group relative px-4 z-50"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* macOS Traffic Lights - Spotify style */}
      {isMac && (
        <div className="absolute left-4 flex items-center gap-2 z-50" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-[#ff5f57] hover:!bg-[#ff5f57]/80 transition-colors"
            title="Close"
          />
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-[#febc2e] hover:!bg-[#febc2e]/80 transition-colors"
            title="Minimize"
          />
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-[#28c840] hover:!bg-[#28c840]/80 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          />
        </div>
      )}

      {/* Empty spacer */}
      <div className="flex-1"></div>

      {/* Windows Controls */}
      {!isMac && (
        <div className="flex items-center ml-auto" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={handleMinimize}
            className="h-10 w-12 flex items-center justify-center hover:bg-accent/50 transition-colors"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={handleMaximize}
            className="h-10 w-12 flex items-center justify-center hover:bg-accent/50 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="h-10 w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
