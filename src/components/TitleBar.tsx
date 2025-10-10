// src/components/TitleBar.tsx
import { Minus, Square, X, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(!!window.electronAPI);
    
    if (window.electronAPI) {
      // Check initial maximized state
      window.electronAPI.windowIsMaximized().then(setIsMaximized);
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

  return (
    <div 
      className="h-10 bg-sidebar border-b border-border flex items-center justify-between px-4 select-none flex-shrink-0"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* App Title */}
      <div className="flex items-center gap-2">
 
      </div>

      {/* Window Controls */}
      <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
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
    </div>
  );
}
