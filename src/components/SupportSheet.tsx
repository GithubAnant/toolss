import { RippleButton } from "./magicui/ripple-button";
import { BottomSheet } from "./BottomSheet";
import { GitHubIcon } from "./GitHubIcon";

interface SupportSheetProps {
  starCount: number | null;
}

export function SupportSheet({ starCount }: SupportSheetProps) {
  return (
    <BottomSheet.Root>
      <BottomSheet.Trigger asChild>
        <RippleButton
          className="text-white font-bold lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg"
          rippleColor="#fff"
        >
          Support
        </RippleButton>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.View>
          <BottomSheet.Backdrop />
          <BottomSheet.Content className="Support-content">
            <BottomSheet.Handle className="Support-handle" />
            <div className="Support-icon">
              <GitHubIcon size={80} className="text-gray-900" />
            </div>
            <div className="Support-information">
              <BottomSheet.Title className="Support-title">
                Star Our Repository
              </BottomSheet.Title>
              <BottomSheet.Description className="flex flex-row text-pretty text-left text-gray-500 font-semibold w-[300px]">
                Help us grow by starring our GitHub repository! Your star helps
                other developers discover toolss and motivates us to keep
                improving.
              </BottomSheet.Description>
            </div>
            <div className="Support-actions">
              <button
                onClick={() =>
                  window.open(
                    "https://github.com/GithubAnant/toolss",
                    "_blank",
                  )
                }
                className="Support-star-button bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105"
              >
                <GitHubIcon size={16} />
                <span>
                  {starCount !== null ? `${starCount} Stars` : "Star on GitHub"}
                </span>
              </button>
            </div>
            <BottomSheet.Trigger
              className="Support-closeButton"
              action="dismiss"
            >
              Maybe Later
            </BottomSheet.Trigger>
          </BottomSheet.Content>
        </BottomSheet.View>
      </BottomSheet.Portal>
    </BottomSheet.Root>
  );
}
