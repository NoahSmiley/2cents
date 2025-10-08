import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categoryOptions: string[];
  who: string;
  onWhoChange: (value: string) => void;
  whoOptions: string[];
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
  who,
  onWhoChange,
  whoOptions,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
}: TransactionFiltersProps) {
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-5">
        <Input
          id="txn-search"
          placeholder="Search note, category, who…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sm:col-span-2"
        />

        <select
          className="h-9 rounded-md border bg-transparent px-3 text-sm"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categoryOptions.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          className="h-9 rounded-md border bg-transparent px-3 text-sm"
          value={who}
          onChange={(e) => onWhoChange(e.target.value)}
        >
          {whoOptions.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClearFilters}>Clear filters</Button>
      </div>
    </>
  );
}
