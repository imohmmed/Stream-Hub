import { useGetCategories } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  type: "movie" | "series" | "live";
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export function CategoryFilter({ type, selectedId, onSelect }: CategoryFilterProps) {
  // We cast to any because the generated enum might be strict, but strings work over the wire
  const { data, isLoading } = useGetCategories({ type: type as any });

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto py-4 px-4 md:px-8 no-scrollbar opacity-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-secondary rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (!data?.categories?.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto py-4 px-4 md:px-8 no-scrollbar">
      <button
        onClick={() => onSelect(undefined)}
        className={cn(
          "px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300",
          !selectedId
            ? "bg-primary text-white shadow-lg shadow-primary/25"
            : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-white"
        )}
      >
        الكل
      </button>
      
      {data.categories.map((cat) => (
        <button
          key={cat.category_id}
          onClick={() => onSelect(cat.category_id)}
          className={cn(
            "px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300",
            selectedId === cat.category_id
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-white"
          )}
        >
          {cat.category_name}
        </button>
      ))}
    </div>
  );
}
