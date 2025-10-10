import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "./CategorySelector";

interface EditGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  target: string;
  setTarget: (target: string) => void;
  category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other";
  setCategory: (category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other") => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  linkedCategories: string[];
  setLinkedCategories: (categories: string[]) => void;
  newLinkInput: string;
  setNewLinkInput: (input: string) => void;
  currency: string;
  onUpdate: () => void;
}

export function EditGoalModal({
  open,
  onOpenChange,
  name,
  setName,
  target,
  setTarget,
  category,
  setCategory,
  targetDate,
  setTargetDate,
  linkedCategories,
  setLinkedCategories,
  newLinkInput,
  setNewLinkInput,
  currency,
  onUpdate,
}: EditGoalModalProps) {
  const handleAddLink = () => {
    if (newLinkInput.trim()) {
      const input = newLinkInput.trim();
      if (!linkedCategories.includes(input)) {
        setLinkedCategories([...linkedCategories, input]);
      }
      setNewLinkInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Goal Name</Label>
            <Input
              placeholder="e.g., Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currency}
              </span>
              <Input
                type="number"
                placeholder="5000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Select Category</Label>
            <CategorySelector 
              value={category} 
              onChange={(val) => setCategory(val)}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Date (Optional)</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          
          {/* Linked Items */}
          <div className="space-y-2 pt-2 border-t">
            <Label>Link to Transactions/Bills</Label>
            <p className="text-xs text-muted-foreground">
              Link transaction categories or recurring bill names to auto-contribute
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Student Loan or Groceries"
                value={newLinkInput}
                onChange={(e) => setNewLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newLinkInput.trim()) {
                    e.preventDefault();
                    handleAddLink();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddLink}
              >
                Add
              </Button>
            </div>
            
            {/* Show linked items */}
            {linkedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {linkedCategories.map((cat) => (
                  <div key={cat} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    {cat}
                    <button
                      onClick={() => setLinkedCategories(linkedCategories.filter(c => c !== cat))}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button onClick={onUpdate} className="w-full text-white">
            Update Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
