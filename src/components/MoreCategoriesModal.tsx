interface MoreCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

const moreCategories = [
  "tools",
  "social",
  "finance",
  "health",
  "education",
  "sports",
  "travel",
  "food",
  "music",
  "gaming",
];

export function MoreCategoriesModal({
  isOpen,
  onClose,
  onSelectCategory,
}: MoreCategoriesModalProps) {
  if (!isOpen) return null;

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">More Categories</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {moreCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
