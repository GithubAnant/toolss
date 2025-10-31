interface MoreCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

const moreCategories = [
  "tools",
  "development tools",
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center pointer-events-auto">
      <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full mx-4 
                      shadow-[0px_0px_30px_0px_rgb(0_0_0_/_0.04),0px_30px_60px_0px_rgb(0_0_0_/_0.12),0px_0px_1px_0px_rgb(0_0_0_/_0.3)]
                      dark:shadow-[0px_0px_30px_0px_rgb(0_0_0_/_0.6),0px_30px_60px_0px_rgb(0_0_0_/_0.7),inset_0px_0px_0px_1px_rgb(255_255_255_/_0.05)]
                      border border-gray-200 dark:border-gray-800 
                      animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">More Categories</h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white 
                       text-2xl w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 
                       transition-all duration-150 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {moreCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="px-4 py-3 rounded-lg 
                         bg-gray-100 dark:bg-gray-900 
                         hover:bg-gray-200 dark:hover:bg-gray-800 
                         text-gray-900 dark:text-white 
                         font-medium text-sm
                         border border-gray-200 dark:border-gray-800
                         transition-all duration-150 ease-out
                         hover:scale-102 hover:shadow-sm"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
