import { RippleButton } from "./magicui/ripple-button";
import type { Tool } from "../lib/supabase";
import React from "react";

interface SelectedImage {
  url: string;
  row: number;
  col: number;
  tool?: Tool;
}

interface ToolModalProps {
  selectedImage: SelectedImage;
  isExiting: boolean;
  onClose: () => void;
  onAnimationEnd: (e: React.AnimationEvent) => void;
}

export function ToolModal({
  selectedImage,
  isExiting,
  onClose,
  onAnimationEnd,
}: ToolModalProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains("dark")
  );

  // Listen for dark mode changes
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`modal-backdrop backdrop-blur-3xl fixed pt-12 inset-0 flex flex-col overflow-y-auto p-4 items-center z-50 ${
        isDarkMode ? "bg-black/35" : "bg-white/50"
      } ${isExiting ? "modal-exiting" : ""}`}
      style={{
        pointerEvents: isExiting ? "none" : "auto",
      }}
      onClick={onClose}
      onAnimationEnd={onAnimationEnd}
    >
      {/* The Image in the expanded view */}
      <div
        className={`modal-image relative mb-6 min-h-[200px] w-full transition-all duration-600 ease-out ${
          isExiting ? "modal-image-exit" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          pointerEvents: isExiting ? "none" : "auto",
        }}
      >
        <img
          src={selectedImage.url}
          alt={
            selectedImage.tool?.name ||
            `Image ${selectedImage.row}-${selectedImage.col}`
          }
          draggable="false"
          className="mx-auto w-full max-w-[280px] h-full rounded-2xl object-contain"
        />
      </div>

      {/* The description section */}
      <div
        className={`modal-content flex w-[300px] flex-col justify-center p-4  transition-all duration-700 ease-out
          ${isDarkMode ? "text-white" : "text-black"} 
          ${isExiting ? "modal-content-exit" : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          pointerEvents: isExiting ? "none" : "auto",
        }}
      >
        {/* Tags - Only show if they exist */}
        {selectedImage.tool?.tags && selectedImage.tool.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedImage.tool.tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal cursor-pointer ${
                  isDarkMode
                    ? "border-white/30 bg-white/10 text-white/80 "
                    : "border-black/30 bg-black/10 text-black/80 "
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tool Name */}
        <h2 className="mb-2 text-3xl font-bold">
          {selectedImage.tool?.name || "Beautiful Image"}
        </h2>

        {/* Category */}
        {selectedImage.tool?.category && (
          <div
            className={`mb-2 text-sm font-semibold uppercase tracking-wide ${
              isDarkMode ? "text-white/60" : "text-black/60"
            } `}
          >
            {selectedImage.tool.category}
          </div>
        )}

        {/* Description */}
        <p
          className={`text-base mb-4 ${
            isDarkMode ? "text-white/80" : "text-black/80"
          }`}
        >
          {selectedImage.tool?.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>

        {/* Launch Video Link - Only show if exists */}
        {selectedImage.tool?.launch_video_link && (
          <div className="mb-4">
            <a
              href={selectedImage.tool.launch_video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              Watch Launch Video
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div
          className={`modal-actions flex w-full gap-4 py-5 items-center justify-center transition-all duration-700 ease-out ${
            isExiting ? "modal-actions-exit" : ""
          }`}
          style={{
            pointerEvents: isExiting ? "none" : "auto",
          }}
        >
          <RippleButton
            className={`w-[120px] rounded-full border-none ${
              isDarkMode ? "bg-white text-black" : "bg-black text-white"
            } `}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <span>Back</span>
          </RippleButton>

          {/* Visit Website Button */}
          {selectedImage.tool?.website_link && (
            <RippleButton
              className={`w-[120px] rounded-full border-none ${
                isDarkMode ? "bg-white text-black" : "bg-black text-white"
              } `}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedImage.tool?.website_link) {
                  window.open(
                    selectedImage.tool.website_link,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
            >
              <span>Visit Site</span>
            </RippleButton>
          )}
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          animation: backdropFadeIn 0.5s ease-out forwards;
        }

        .modal-backdrop.modal-exiting {
          animation: backdropFadeOut 0.7s ease-out forwards;
        }

        .modal-buttons {
          animation: slideUpFade 0.7s ease-out 0.4s both;
        }

        .modal-buttons.modal-buttons-exit {
          animation: slideDownFade 0.4s ease-out forwards;
        }

        .modal-image {
          animation: scaleBlurFade 0.6s ease-out 0.1s both;
        }

        .modal-image.modal-image-exit {
          animation: scaleBlurFadeOut 0.4s ease-out forwards;
        }

        .modal-content {
          animation: slideUpFade 0.7s ease-out 0.2s both;
        }

        .modal-content.modal-content-exit {
          animation: slideDownFade 0.4s ease-out forwards;
        }

        .modal-actions {
          animation: slideUpFade 0.7s ease-out 0.3s both;
        }

        .modal-actions.modal-actions-exit {
          animation: slideDownFade 0.3s ease-out forwards;
        }

        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes backdropFadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes scaleBlurFade {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0px);
            filter: blur(0px);
          }
        }

        @keyframes scaleBlurFadeOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0px);
            filter: blur(0px);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
            filter: blur(6px);
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
            filter: blur(0px);
          }
        }

        @keyframes slideDownFade {
          from {
            opacity: 1;
            transform: translateY(0px);
            filter: blur(0px);
          }
          to {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(4px);
          }
        }
      `}</style>
    </div>
  );
}
