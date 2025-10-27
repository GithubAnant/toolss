import { RippleButton } from "./magicui/ripple-button";
import { BottomSheet } from "./BottomSheet";
import { Info } from "lucide-react";

export function LearnMoreSheet() {
  return (
    <BottomSheet.Root>
      <BottomSheet.Trigger asChild>
        <RippleButton
          className="text-white font-bold lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg"
          rippleColor="#fff"
        >
          Learn More
        </RippleButton>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.View>
          <BottomSheet.Backdrop />
          <BottomSheet.Content className="LearnMore-content">
            <BottomSheet.Handle className="LearnMore-handle" />
            <div className="LearnMore-icon">
              <Info size={80} strokeWidth={2} />
            </div>
            <div className="LearnMore-information">
              <BottomSheet.Title className="LearnMore-title font-black!">
                About Toolss
              </BottomSheet.Title>
              <BottomSheet.Description className="flex flex-row text-pretty text-left text-gray-500 font-semibold w-[300px]">
                Toolss is an AI-powered icon generator that creates beautiful,
                unique icons instantly.
              </BottomSheet.Description>
            </div>
            <BottomSheet.Trigger
              className="LearnMore-closeButton"
              action="dismiss"
            >
              Close
            </BottomSheet.Trigger>
          </BottomSheet.Content>
        </BottomSheet.View>
      </BottomSheet.Portal>
    </BottomSheet.Root>
  );
}
