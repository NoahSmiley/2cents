# Component Usage Examples

This guide shows how to use the newly modularized components.

## Dashboard Components

### Using Stat Component
```typescript
import { Stat } from '@/components/dashboard';

function MyPage() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Stat title="Total Revenue" value="$12,345" />
      <Stat title="Active Users" value="1,234" />
      <Stat title="Conversion Rate" value="3.2%" accent />
    </div>
  );
}
```

### Using SpendingChart
```typescript
import { SpendingChart } from '@/components/dashboard';

function MyDashboard() {
  const data = [
    { name: 'Food', value: 450.50 },
    { name: 'Transport', value: 200.00 },
    { name: 'Entertainment', value: 150.75 }
  ];

  const colorMap = (name: string) => {
    const colors = { Food: '#FF6384', Transport: '#36A2EB', Entertainment: '#FFCE56' };
    return colors[name] || '#999';
  };

  return (
    <div className="h-64">
      <SpendingChart data={data} colorMap={colorMap} currency="$" />
    </div>
  );
}
```

### Using CategoryProgress
```typescript
import { CategoryProgress } from '@/components/dashboard';

function BudgetOverview() {
  const categories = [
    { id: '1', name: 'Groceries', limit: 500 },
    { id: '2', name: 'Dining', limit: 300 }
  ];

  const spent = {
    'Groceries': 350.50,
    'Dining': 275.00
  };

  const colorMap = (name: string) => '#3B82F6';

  return (
    <CategoryProgress
      categories={categories}
      spentByCategory={spent}
      colorMap={colorMap}
      currency="$"
    />
  );
}
```

## Transaction Components

### Using ModeToggle
```typescript
import { ModeToggle } from '@/components/transaction';
import { useState } from 'react';

function TransactionForm() {
  const [mode, setMode] = useState<'expense' | 'income'>('expense');

  return (
    <div>
      <ModeToggle mode={mode} setMode={setMode} />
      {/* Rest of form */}
    </div>
  );
}
```

### Using QuickPicks
```typescript
import { QuickPicks, loadQuick, saveQuick } from '@/components/transaction';
import type { QuickPick } from '@/components/transaction';
import { useState } from 'react';

function QuickPicksExample() {
  const [picks, setPicks] = useState<QuickPick[]>(() => loadQuick());

  const handleApply = (pick: QuickPick) => {
    console.log('Applied:', pick);
    // Apply the quick pick values to your form
  };

  const handleRemove = (id: string) => {
    const updated = picks.filter(p => p.id !== id);
    setPicks(updated);
    saveQuick(updated);
  };

  const handleSave = () => {
    const newPick: QuickPick = {
      id: crypto.randomUUID(),
      label: 'Coffee',
      mode: 'expense',
      amount: -5.50,
      category: 'Dining',
      note: 'Morning coffee'
    };
    const updated = [newPick, ...picks];
    setPicks(updated);
    saveQuick(updated);
  };

  return (
    <QuickPicks
      picks={picks}
      onApply={handleApply}
      onRemove={handleRemove}
      onSaveCurrent={handleSave}
    />
  );
}
```

### Using CategorySelector
```typescript
import { CategorySelector } from '@/components/transaction';
import { useState } from 'react';

function CategoryForm() {
  const [category, setCategory] = useState('Food');
  const [mode, setMode] = useState<'expense' | 'income'>('expense');

  const categories = [
    { id: '1', name: 'Food', limit: 500 },
    { id: '2', name: 'Transport', limit: 200 }
  ];

  return (
    <CategorySelector
      categories={categories}
      selected={category}
      onSelect={setCategory}
      mode={mode}
    />
  );
}
```

## Recurring Bills Components

### Using PaidAction
```typescript
import { PaidAction } from '@/components/recurring';
import { useState } from 'react';

function BillRow() {
  const [isPending, setIsPending] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const handleMarkPaid = () => {
    setIsPending(true);
    setCelebrate(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPending(false);
      setCelebrate(false);
      console.log('Bill marked as paid!');
    }, 1100);
  };

  return (
    <PaidAction
      pending={isPending}
      celebrate={celebrate}
      onClick={handleMarkPaid}
      fx="confetti"
    />
  );
}
```

### Using Table Helpers
```typescript
import { Th, Td, LegendSwatch } from '@/components/recurring';

function CustomTable() {
  return (
    <>
      <table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th className="text-right">Amount</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Rent</Td>
            <Td className="text-right">$1,400</Td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-3 mt-3">
        <LegendSwatch className="bg-green-500" label="Paid" />
        <LegendSwatch className="bg-red-500" label="Overdue" outline />
      </div>
    </>
  );
}
```

## Transaction List Components

### Using TransactionFilters
```typescript
import { TransactionFilters } from '@/components/transactions';
import { useState } from 'react';

function FilterableList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [who, setWho] = useState('Anyone');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const clearFilters = () => {
    setSearch('');
    setCategory('All categories');
    setWho('Anyone');
    setFrom('');
    setTo('');
  };

  return (
    <TransactionFilters
      searchQuery={search}
      onSearchChange={setSearch}
      category={category}
      onCategoryChange={setCategory}
      categoryOptions={['All categories', 'Food', 'Transport']}
      who={who}
      onWhoChange={setWho}
      whoOptions={['Anyone', 'Noah', 'Sam']}
      dateFrom={from}
      onDateFromChange={setFrom}
      dateTo={to}
      onDateToChange={setTo}
      onClearFilters={clearFilters}
    />
  );
}
```

### Using TransactionTable
```typescript
import { TransactionTable } from '@/components/transactions';

function TransactionList() {
  const transactions = [
    {
      id: '1',
      date: '2025-10-08',
      amount: -45.50,
      category: 'Food',
      note: 'Grocery shopping',
      who: 'Noah'
    },
    {
      id: '2',
      date: '2025-10-07',
      amount: 2000.00,
      category: 'Income',
      note: 'Salary',
      who: 'Noah'
    }
  ];

  const handleDelete = (id: string) => {
    console.log('Delete transaction:', id);
  };

  return (
    <TransactionTable
      transactions={transactions}
      currency="$"
      onDelete={handleDelete}
      income={2000}
      spending={45.50}
    />
  );
}
```

## Utility Functions

### Using Color Utilities
```typescript
import { colorFor, createColorMap, FADE_PALETTE } from '@/lib/colors';

// Get a consistent color for a category
const categoryColor = colorFor('Food'); // Returns a color from RAINBOW palette

// Create a color map for multiple categories
const categories = ['Food', 'Transport', 'Entertainment'];
const colorMap = createColorMap(categories, FADE_PALETTE);

// Use the color map
const foodColor = colorMap.get('Food');
```

### Using Format Utilities
```typescript
import { formatNum, formatCurrency, escapeCSV } from '@/lib/format';

// Format numbers
const formatted = formatNum(1234.56); // "1,235"

// Format currency
const price = formatCurrency(99.99, '$'); // "$99.99"

// Escape CSV values
const csvValue = escapeCSV('Value with "quotes"'); // "Value with ""quotes"""
```

### Using Date Utilities
```typescript
import {
  todayISO,
  startOfDay,
  nextDueDate,
  daysBetween,
  formatShort
} from '@/lib/date-utils';

// Get today's date
const today = todayISO(); // "2025-10-08"

// Get start of day
const start = startOfDay(new Date()); // Date at 00:00:00

// Calculate next due date
const nextDue = nextDueDate(15); // Next 15th of the month

// Calculate days between dates
const days = daysBetween(new Date('2025-10-01'), new Date('2025-10-08')); // 7

// Format date
const formatted = formatShort(new Date('2025-10-08')); // "Oct 8"
```

## Barrel Exports

All component directories have index files for cleaner imports:

```typescript
// Instead of:
import { Stat } from '@/components/dashboard/Stat';
import { SpendingChart } from '@/components/dashboard/SpendingChart';

// You can use:
import { Stat, SpendingChart } from '@/components/dashboard';
```

Available barrel exports:
- `@/components/dashboard`
- `@/components/recurring`
- `@/components/transaction`
- `@/components/transactions`

## Best Practices

1. **Import from barrel exports** when importing multiple components from the same feature
2. **Use type imports** for TypeScript types: `import type { QuickPick } from '...'`
3. **Keep components focused** - each component should have a single responsibility
4. **Use utility functions** instead of duplicating logic across components
5. **Pass callbacks** rather than having components manage global state directly
