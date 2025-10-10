import { Input } from "@/components/ui/input";

interface BillEditFormProps {
  editForm: {
    name: string;
    amount: string;
    dueDay: string;
    linkedGoalId: string;
    category: string;
  };
  setEditForm: (form: any) => void;
  categories: Array<{ id: string; name: string }>;
  goals: Array<{ id: string; name: string; completedAt?: string }>;
}

export function BillEditForm({ editForm, setEditForm, categories, goals }: BillEditFormProps) {
  return (
    <div className="space-y-2">
      <Input
        type="number"
        value={editForm.dueDay}
        onChange={(e) => setEditForm((prev: any) => ({ ...prev, dueDay: e.target.value }))}
        className="h-8 text-sm w-16 mx-auto"
        min={1}
        max={31}
      />
      <select
        value={editForm.category}
        onChange={(e) => setEditForm((prev: any) => ({ ...prev, category: e.target.value }))}
        className="h-8 text-xs w-full rounded-md border bg-transparent px-2"
      >
        <option value="">No Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        value={editForm.linkedGoalId}
        onChange={(e) => setEditForm((prev: any) => ({ ...prev, linkedGoalId: e.target.value }))}
        className="h-8 text-xs w-full rounded-md border bg-transparent px-2"
      >
        <option value="">No Goal</option>
        {goals.filter(g => !g.completedAt).map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.name}
          </option>
        ))}
      </select>
    </div>
  );
}
