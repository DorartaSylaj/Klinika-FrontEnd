import { Button } from "./ui/Button";
import { TextInput } from "./ui/TextInput";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
  day: string;
  setDay: (v: string) => void;
  showOnlyUrgent: boolean;
  setShowOnlyUrgent: (v: boolean) => void;
  onAddPatient: () => void;
  onExport: () => void;
};

export default function FiltersBar({
  search,
  setSearch,
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
  showOnlyUrgent,
  setShowOnlyUrgent,
  onAddPatient,
  onExport,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <TextInput
          placeholder="Kërko sipas emrit ose mbiemrit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextInput
          type="number"
          placeholder="Viti"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-24"
        />
        <TextInput
          type="number"
          placeholder="Muaji"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-20"
        />
        <TextInput
          type="number"
          placeholder="Dita"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-20"
        />
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={showOnlyUrgent}
            onChange={(e) => setShowOnlyUrgent(e.target.checked)}
          />
          Vetëm URGENT
        </label>
      </div>
      <div className="flex gap-2">
        <Button variant="green" onClick={onAddPatient}>
          + Shto Pacient
        </Button>
        <Button variant="blue" onClick={onExport}>
          Eksporto Excel
        </Button>
      </div>
    </div>
  );
}
