# Architecture Overview

## Component Organization

### Before Refactoring
```
src/pages/
├── Dashboard.tsx (248 lines)
│   ├── Inline: Stat component
│   ├── Inline: DotSwatch component
│   ├── Inline: Pie chart logic
│   ├── Inline: Category progress
│   ├── Inline: Recent transactions
│   └── Inline: formatNum, color utilities
│
├── RecurringBills.tsx (489 lines)
│   ├── Inline: ButtonCelebration
│   ├── Inline: PaidAction
│   ├── Inline: Table helpers
│   ├── Inline: Date utilities
│   └── Inline: Type definitions
│
├── AddTransaction.tsx (422 lines)
│   ├── Inline: ModeToggle
│   ├── Inline: QuickPicks
│   ├── Inline: CategorySelector
│   ├── Inline: PayerSelector
│   ├── Inline: TransactionPreview
│   └── Inline: Color utilities
│
└── Transactions.tsx (260 lines)
    ├── Inline: TransactionFilters
    ├── Inline: TransactionTable
    ├── Inline: Table helpers
    └── Inline: Format utilities
```

### After Refactoring
```
src/
├── pages/                      # Lean page components (business logic only)
│   ├── Dashboard.tsx           (133 lines) ⬇️ 46% reduction
│   ├── RecurringBills.tsx      (264 lines) ⬇️ 46% reduction
│   ├── AddTransaction.tsx      (216 lines) ⬇️ 49% reduction
│   └── Transactions.tsx        (169 lines) ⬇️ 35% reduction
│
├── components/
│   ├── dashboard/              # Dashboard feature components
│   │   ├── index.ts            (barrel export)
│   │   ├── Stat.tsx            (18 lines)
│   │   ├── DotSwatch.tsx       (10 lines)
│   │   ├── SpendingChart.tsx   (35 lines)
│   │   ├── CategoryProgress.tsx (50 lines)
│   │   └── RecentTransactions.tsx (35 lines)
│   │
│   ├── recurring/              # Recurring bills feature
│   │   ├── index.ts            (barrel export)
│   │   ├── ButtonCelebration.tsx (90 lines)
│   │   ├── PaidAction.tsx      (70 lines)
│   │   ├── TableHelpers.tsx    (30 lines)
│   │   └── types.ts            (10 lines)
│   │
│   ├── transaction/            # Transaction form feature
│   │   ├── index.ts            (barrel export)
│   │   ├── ModeToggle.tsx      (30 lines)
│   │   ├── QuickPicks.tsx      (90 lines)
│   │   ├── CategorySelector.tsx (55 lines)
│   │   ├── PayerSelector.tsx   (35 lines)
│   │   └── TransactionPreview.tsx (40 lines)
│   │
│   └── transactions/           # Transaction list feature
│       ├── index.ts            (barrel export)
│       ├── TransactionFilters.tsx (70 lines)
│       └── TransactionTable.tsx (90 lines)
│
└── lib/                        # Shared utilities
    ├── colors.ts               (45 lines)
    ├── format.ts               (15 lines)
    └── date-utils.ts           (55 lines)
```

## Dependency Graph

```
Dashboard.tsx
├── components/dashboard/*
├── lib/colors.ts
└── lib/format.ts

RecurringBills.tsx
├── components/recurring/*
└── lib/date-utils.ts

AddTransaction.tsx
├── components/transaction/*
└── lib/colors.ts

Transactions.tsx
├── components/transactions/*
└── lib/format.ts
```

## Import Patterns

### Old Pattern (Inline)
```typescript
// Everything defined in the same file
function Stat({ title, value }: Props) { ... }
function formatNum(n: number) { ... }

export default function Dashboard() {
  // Uses Stat and formatNum directly
}
```

### New Pattern (Modular)
```typescript
// Clean imports from organized modules
import { Stat, SpendingChart, CategoryProgress } from '@/components/dashboard';
import { formatNum } from '@/lib/format';
import { createColorMap, FADE_PALETTE } from '@/lib/colors';

export default function Dashboard() {
  // Focused on business logic
}
```

## Benefits by Layer

### Page Layer (src/pages/)
- ✅ Reduced complexity
- ✅ Focused on state management and data flow
- ✅ Easier to understand business logic
- ✅ Faster to locate and fix bugs

### Component Layer (src/components/)
- ✅ Single responsibility principle
- ✅ Reusable across features
- ✅ Easier to test in isolation
- ✅ Clear component interfaces

### Utility Layer (src/lib/)
- ✅ Pure functions, no side effects
- ✅ Easy to unit test
- ✅ Consistent behavior across app
- ✅ Single source of truth

## Code Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Total Page Lines** | 1,419 | 782 | -45% |
| **Avg Page Size** | 355 lines | 196 lines | -45% |
| **Component Files** | 4 | 24 | +500% |
| **Utility Files** | 0 | 3 | New |
| **Reusable Components** | 0 | 20 | New |
| **Code Duplication** | High | Low | ⬇️ |

## Testing Strategy

### Unit Tests (Recommended)
```
components/dashboard/
├── Stat.test.tsx
├── SpendingChart.test.tsx
└── CategoryProgress.test.tsx

lib/
├── colors.test.ts
├── format.test.ts
└── date-utils.test.ts
```

### Integration Tests
```
pages/
├── Dashboard.test.tsx
├── RecurringBills.test.tsx
├── AddTransaction.test.tsx
└── Transactions.test.tsx
```

## Future Improvements

1. **Further Modularization**
   - Extract form input wrappers
   - Create shared modal components
   - Standardize button variants

2. **Performance Optimization**
   - Lazy load heavy components
   - Memoize expensive calculations
   - Code split by route

3. **Developer Experience**
   - Add Storybook for component documentation
   - Create component templates
   - Add ESLint rules for import organization

4. **Type Safety**
   - Create shared type definitions
   - Add stricter TypeScript config
   - Generate types from schemas
