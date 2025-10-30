import InfiniteGrid from "../InfiniteGrid";
import { useState } from "react";
import type { Tool } from "../lib/supabase";

// Component imports
import { SearchBar } from "../components/SearchBar";
import { CreateButton } from "../components/CreateButton";
import { CategoryNav } from "../components/CategoryNav";
import { MoreCategoriesModal } from "../components/MoreCategoriesModal";
import { LearnMoreSheet } from "../components/LearnMoreSheet";
import { SupportSheet } from "../components/SupportSheet";
import { ToolModal } from "../components/ToolModal";
import { AuthMenuButton } from "../components/AuthMenu";
// import { ToolOfTheDay } from "../components/ToolOfTheDay";

// Hook imports
import { useGitHubStars } from "../hooks/useGitHubStars";

interface SelectedImage {
  url: string;
  row: number;
  col: number;
  tool?: Tool;
}

export function HomePage() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [isExiting, setIsExiting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMoreModal, setShowMoreModal] = useState(false);

  const starCount = useGitHubStars("GithubAnant/toolss");

  const handleImageClick = (imageData: SelectedImage) => {
    setSelectedImage(imageData);
    setIsExiting(false);
  };

  const handleCloseModal = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (isExiting && e.animationName === "backdropFadeOut") {
      setSelectedImage(null);
      setIsExiting(false);
    }
  };

  return (
    <div className="relative w-dvw h-dvh flex justify-center items-center flex-col bg-white dark:bg-black transition-colors duration-150">
      {/* Header with Nav */}
      <div className="absolute top-6 left-6 right-6 flex items-center gap-4 z-10 pointer-events-auto">
        <SearchBar />
        <CreateButton />
      </div>

      {/* Category navigation in top right */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onMoreClick={() => setShowMoreModal(true)}
        />


      {/* More Categories Modal */}
      <MoreCategoriesModal
        isOpen={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        onSelectCategory={setSelectedCategory}
      />

      {/* Auth Menu Button (3 dots bottom left) */}
      <AuthMenuButton />

      {/* Tool of the Day (bottom right floating button) */}
      {/* <ToolOfTheDay /> */}

      {/* Bottom action buttons */}
      <div className="absolute flex flex-col pointer-events-none justify-center items-center w-[300px] bg-transparent h-full z-10">
        <div className="bottomButtonsContainers absolute bottom-6 flex flex-row gap-4 justify-center items-center pointer-events-auto">
          <LearnMoreSheet />
          <SupportSheet starCount={starCount} />
        </div>
      </div>

      {/* Infinite Grid */}
      <InfiniteGrid
        onImageClick={handleImageClick}
        animationType="polkadot"
        disableCustomScroll={false}
      />

      {/* Tool Modal */}
      {selectedImage && (
        <ToolModal
          selectedImage={selectedImage}
          isExiting={isExiting}
          onClose={handleCloseModal}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
    </div>
  );
}
