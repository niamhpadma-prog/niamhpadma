"use client";

interface FilterBarProps {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
}

export function FilterBar({ filters, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`font-sans text-sm px-5 py-2 rounded-full transition-all duration-300 ${
            active === filter
              ? "bg-espresso text-cream"
              : "bg-cream-dark text-espresso/60 hover:text-espresso"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
