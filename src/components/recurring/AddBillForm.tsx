interface AddBillFormProps {
  newName: string;
  setNewName: (name: string) => void;
  newAmount: string;
  setNewAmount: (amount: string) => void;
  newDueDay: string;
  setNewDueDay: (day: string) => void;
  newCategory: string;
  setNewCategory: (category: string) => void;
  newLinkedGoalId: string;
  setNewLinkedGoalId: (goalId: string) => void;
  categories: Array<{ id: string; name: string }>;
  goals: Array<{ id: string; name: string; completedAt?: string }>;
  onAdd: () => void;
}

export function AddBillForm({
  newName,
  setNewName,
  newAmount,
  setNewAmount,
  newDueDay,
  setNewDueDay,
  newCategory,
  setNewCategory,
  newLinkedGoalId,
  setNewLinkedGoalId,
  categories,
  goals,
  onAdd,
}: AddBillFormProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6 w-full sm:w-auto">
      <input
        placeholder="Name (e.g. Rent)"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="h-9 rounded-md border bg-transparent px-3 text-sm"
      />
      <input
        placeholder="Amount"
        type="number"
        value={newAmount}
        onChange={(e) => setNewAmount(e.target.value)}
        className="h-9 rounded-md border bg-transparent px-3 text-sm"
      />
      <input
        placeholder="Due day (1-31)"
        type="number"
        value={newDueDay}
        min={1}
        max={31}
        onChange={(e) => setNewDueDay(e.target.value)}
        className="h-9 rounded-md border bg-transparent px-3 text-sm"
      />
      <select
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="h-9 rounded-md border bg-transparent px-3 text-sm"
      >
        <option value="">Category (Optional)</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        value={newLinkedGoalId}
        onChange={(e) => setNewLinkedGoalId(e.target.value)}
        className="h-9 rounded-md border bg-transparent px-3 text-sm"
      >
        <option value="">Goal (Optional)</option>
        {goals.filter(g => !g.completedAt).map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.name}
          </option>
        ))}
      </select>
      <button
        onClick={onAdd}
        className="h-9 rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90"
      >
        Add
      </button>
    </div>
  );
}
