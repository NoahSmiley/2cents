import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Minus } from "lucide-react";

interface CalculatorProps {
  onClose: () => void;
}

export function Calculator({ onClose }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const calcRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on a button or input
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumber(e.key);
      }
      // Operations
      else if (e.key === '+') {
        e.preventDefault();
        handleOperation('+');
      }
      else if (e.key === '-') {
        e.preventDefault();
        handleOperation('-');
      }
      else if (e.key === '*') {
        e.preventDefault();
        handleOperation('×');
      }
      else if (e.key === '/') {
        e.preventDefault();
        handleOperation('÷');
      }
      // Decimal
      else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      }
      // Equals
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      }
      // Clear
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      }
      // Backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, newNumber]);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay("0.");
      setNewNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue !== null && operation && !newNumber) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+": return prev + current;
      case "-": return prev - current;
      case "×": return prev * current;
      case "÷": return current !== 0 ? prev / current : 0;
      default: return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
      setNewNumber(true);
    }
  };

  return (
      <div 
        ref={calcRef}
        className="fixed z-50" 
        style={{ 
          left: `calc(50% + ${position.x}px)`, 
          top: `calc(50% + ${position.y}px)`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card 
          className="w-64 shadow-2xl border-2 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          {/* Header */}
          <div className="bg-muted/50 px-3 py-2 flex items-center justify-between border-b">
            <span className="text-sm font-medium">Calculator</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Display */}
          <div className="p-4 bg-muted/30">
            <div className="text-right text-2xl font-mono font-semibold break-all">
              {display}
            </div>
            {operation && (
              <div className="text-right text-xs text-muted-foreground mt-1">
                {previousValue} {operation}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="p-3 grid grid-cols-4 gap-2 cursor-default">
            <Button variant="outline" onClick={handleClear} className="col-span-2">
              C
            </Button>
            <Button variant="outline" onClick={handleBackspace}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => handleOperation("÷")}>
              ÷
            </Button>

            <Button variant="outline" onClick={() => handleNumber("7")}>7</Button>
            <Button variant="outline" onClick={() => handleNumber("8")}>8</Button>
            <Button variant="outline" onClick={() => handleNumber("9")}>9</Button>
            <Button variant="outline" onClick={() => handleOperation("×")}>×</Button>

            <Button variant="outline" onClick={() => handleNumber("4")}>4</Button>
            <Button variant="outline" onClick={() => handleNumber("5")}>5</Button>
            <Button variant="outline" onClick={() => handleNumber("6")}>6</Button>
            <Button variant="outline" onClick={() => handleOperation("-")}>-</Button>

            <Button variant="outline" onClick={() => handleNumber("1")}>1</Button>
            <Button variant="outline" onClick={() => handleNumber("2")}>2</Button>
            <Button variant="outline" onClick={() => handleNumber("3")}>3</Button>
            <Button variant="outline" onClick={() => handleOperation("+")}>+</Button>

            <Button variant="outline" onClick={() => handleNumber("0")} className="col-span-2">
              0
            </Button>
            <Button variant="outline" onClick={handleDecimal}>.</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white" 
              onClick={handleEquals}
            >
              =
            </Button>
          </div>
        </Card>
      </div>
  );
}
