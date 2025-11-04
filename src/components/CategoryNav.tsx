interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onMoreClick: () => void;
}

const categories = [
  { name: "all", color: "bg-orange-400/60" },
  { name: "browsers", color: "bg-yellow-400/60" },
  { name: "ai", color: "bg-blue-400/60" },
  { name: "no code", color: "bg-purple-400/60" },
  { name: "design", color: "bg-pink-400/60" },
  { name: "coding", color: "bg-green-400/60" },
  { name: "video", color: "bg-red-400/60" },
];

export function CategoryNav({
  selectedCategory,
  onCategoryChange,
  onMoreClick,
}: CategoryNavProps) {
  return (
    <div className="absolute top-6 right-6 flex flex-col md:flex-row items-end md:items-center gap-1.5 md:gap-2 z-10 pointer-events-auto">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onCategoryChange(category.name)}
          className={`px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all backdrop-blur-lg ${
            category.color
          } text-white duration-200 ease-in-out cursor-pointer ${
            selectedCategory === category.name
              ? "font-bold scale-105 border-1 border-color border-white"
              : "font-medium scale-100"
          }`}
        >
          {category.name}
        </button>
      ))}

      {/* More button */}
      <button
        onClick={onMoreClick}
        className="px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-lg bg-slate-500/60 text-white hover:bg-slate-500/80"
      >
        more
      </button>
    </div>
  );
}
