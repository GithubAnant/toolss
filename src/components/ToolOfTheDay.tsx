import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Tool } from "../lib/supabase";

export function ToolOfTheDay() {
  const [isOpen, setIsOpen] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    fetchToolOfTheDay();
  }, []);

  const fetchToolOfTheDay = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // First, check if there's a manually set tool of the day
      const { data: totdData } = await supabase
        .from("tool_of_the_day")
        .select("tool_id")
        .eq("date", today)
        .single();

      if (totdData) {
        // Fetch the specific tool
        const { data: toolData } = await supabase
          .from("tools")
          .select("*")
          .eq("id", totdData.tool_id)
          .single();

        if (toolData) {
          setTool(toolData);
          return;
        }
      }

      // If no manual selection, get a random tool
      const { data: tools } = await supabase
        .from("tools")
        .select("*")
        .limit(100);

      if (tools && tools.length > 0) {
        const randomTool = tools[Math.floor(Math.random() * tools.length)];
        setTool(randomTool);
      }
    } catch (error) {
      console.error("Error fetching tool of the day:", error);
    }
  };

  const handleButtonClick = () => {
    // Always open modal popup instead of using parent callback
    setIsOpen(true);
  };

  if (!tool) return null;

  return (
    <>
      {/* Floating Action Button - Bottom Right */}
      <button
        onClick={handleButtonClick}
        className="fixed right-6 bottom-6 z-10 pointer-events-auto group"
        aria-label="Tool of the Day"
      >
        <div className="relative">
          {/* Glow effect - Grayscale */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-gray-600 dark:via-gray-500 dark:to-gray-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
          
          {/* Main button - Icon only */}
          <div className="relative bg-white dark:bg-black rounded-full p-3 border border-gray-200 dark:border-gray-800 backdrop-blur-md group-hover:scale-110 transition-all duration-150 ease-out
                          shadow-[0px_0px_15px_0px_rgb(0_0_0_/_0.03),0px_2px_30px_0px_rgb(0_0_0_/_0.08),0px_0px_1px_0px_rgb(0_0_0_/_0.3)]
                          dark:shadow-[0px_0px_15px_0px_rgb(0_0_0_/_0.5),0px_2px_30px_0px_rgb(0_0_0_/_0.6),inset_0px_0px_0px_1px_rgb(255_255_255_/_0.05)]">
            <svg
              className="w-7 h-7 text-gray-900 dark:text-gray-100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-black rounded-xl p-8 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-800 transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-gray-900 dark:text-gray-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tool of the Day</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150"
              >
                ×
              </button>
            </div>

            {/* Tool Image */}
            <div className="mb-6 flex justify-center">
              <img
                src={tool.image_link}
                alt={tool.name}
                className="w-32 h-32 object-contain rounded-xl border border-gray-200 dark:border-gray-800"
              />
            </div>

            {/* Tool Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 font-medium">
                {tool.category}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{tool.description}</p>

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {tool.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12 px-6 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 
                           text-gray-900 dark:text-white rounded-lg font-medium 
                           border border-gray-200 dark:border-gray-800
                           transition-all duration-150 ease-out"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.open(tool.website_link, "_blank", "noopener,noreferrer");
                }}
                className="flex-1 h-12 px-6 bg-black dark:bg-white text-white dark:text-black rounded-lg 
                           hover:bg-gray-800 dark:hover:bg-gray-100 font-medium 
                           transition-all duration-150 ease-out
                           shadow-[0px_0px_5px_0px_rgb(0_0_0_/_0.02),0px_2px_10px_0px_rgb(0_0_0_/_0.06),0px_0px_1px_0px_rgb(0_0_0_/_0.3)]
                           dark:shadow-[0px_0px_5px_0px_rgb(0_0_0_/_0.4),0px_2px_10px_0px_rgb(0_0_0_/_0.5),inset_0px_0px_0px_1px_rgb(255_255_255_/_0.05)]"
              >
                Visit Website
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
