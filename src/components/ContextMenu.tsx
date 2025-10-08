import { useEffect, useState } from "react";
import { Calculator as CalcIcon, Copy, ExternalLink } from "lucide-react";
import { Calculator } from "./Calculator";

export function ContextMenu() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setContextMenu(null);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleCalculator = () => {
    setShowCalculator(true);
    setContextMenu(null);
  };

  const handleCopy = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
    setContextMenu(null);
  };

  const handleReload = () => {
    window.location.reload();
    setContextMenu(null);
  };

  if (!contextMenu && !showCalculator) return null;

  return (
    <>
      {contextMenu && (
        <div
          className="fixed z-50 bg-popover border rounded-md shadow-lg py-1 min-w-[180px]"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button
            onClick={handleCalculator}
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
          >
            <CalcIcon className="h-4 w-4" />
            Calculator
          </button>
          
          {window.getSelection()?.toString() && (
            <button
              onClick={handleCopy}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          )}
          
          <div className="border-t my-1" />
          
          <button
            onClick={handleReload}
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Reload Page
          </button>
        </div>
      )}

      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
    </>
  );
}
