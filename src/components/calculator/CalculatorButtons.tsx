import { Button } from "@/components/ui/button";

interface CalculatorButtonsProps {
  onNumber: (num: string) => void;
  onOperation: (op: string) => void;
  onDecimal: () => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function CalculatorButtons({
  onNumber,
  onOperation,
  onDecimal,
  onEquals,
  onClear,
  onBackspace,
}: CalculatorButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button variant="outline" onClick={onClear} className="col-span-2">C</Button>
      <Button variant="outline" onClick={onBackspace}>←</Button>
      <Button variant="outline" onClick={() => onOperation('÷')}>÷</Button>
      
      <Button variant="outline" onClick={() => onNumber('7')}>7</Button>
      <Button variant="outline" onClick={() => onNumber('8')}>8</Button>
      <Button variant="outline" onClick={() => onNumber('9')}>9</Button>
      <Button variant="outline" onClick={() => onOperation('×')}>×</Button>
      
      <Button variant="outline" onClick={() => onNumber('4')}>4</Button>
      <Button variant="outline" onClick={() => onNumber('5')}>5</Button>
      <Button variant="outline" onClick={() => onNumber('6')}>6</Button>
      <Button variant="outline" onClick={() => onOperation('-')}>-</Button>
      
      <Button variant="outline" onClick={() => onNumber('1')}>1</Button>
      <Button variant="outline" onClick={() => onNumber('2')}>2</Button>
      <Button variant="outline" onClick={() => onNumber('3')}>3</Button>
      <Button variant="outline" onClick={() => onOperation('+')}>+</Button>
      
      <Button variant="outline" onClick={() => onNumber('0')} className="col-span-2">0</Button>
      <Button variant="outline" onClick={onDecimal}>.</Button>
      <Button variant="default" onClick={onEquals}>=</Button>
    </div>
  );
}
