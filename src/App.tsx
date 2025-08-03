import  InfiniteGrid  from './InfiniteGrid'
import { RippleButton } from './components/magicui/ripple-button';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BottomSheet } from './components/BottomSheet';
import './components/BottomSheet.css';
import { Info, Heart } from 'lucide-react';

interface SelectedImage {
  url: string;
  row: number;
  col: number;
}

// Note: I created descriptions of the divs/their purpose, the styling is mostly in tailwind only
// This is just to help me keep track what div does what without having to create a react arrow function
function App() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleImageClick = (imageData: SelectedImage) => {
    setSelectedImage(imageData);
    setIsExiting(false);
  };

  const handleCloseModal = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (isExiting && e.animationName === 'backdropFadeOut') {
      setSelectedImage(null);
      setIsExiting(false);
    }
  };

  return (
    <div className="relative w-dvw h-dvh flex justify-center items-center flex-col">
      <div className=" absolute flex flex-col pointer-events-none justify-center items-center w-[300px] bg-transparent h-full z-10">
        <div className="topTextContainer absolute top-10 bg-black/50 rounded-full p-3 text-white  font-black text-3xl">
          iconly
        </div>
        <div className="searchContainer absolute top-20 mt-16 pointer-events-auto">
          <input 
            type="text" 
            placeholder="create an icon..." 
            className="w-[300px] px-4 py-3 bg-black/30 backdrop-blur-lg rounded-full text-white placeholder-white/70 border-none outline-none focus:bg-black/40 transition-all"
          />
        </div>
        <div className="bottomButtonsContainers  absolute bottom-9 flex flex-row gap-4 justify-center items-center pointer-events-auto">

        <BottomSheet.Root>
          <BottomSheet.Trigger asChild>
            <RippleButton className="text-white font-bold lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg" rippleColor='#fff'>
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
                    About iconly
                  </BottomSheet.Title>
                  <BottomSheet.Description className="flex flex-row text-pretty text-left text-gray-500 font-semibold w-[300px]">
                    iconly is an AI-powered icon generator that creates beautiful, unique icons instantly.
                  </BottomSheet.Description>
                </div>
                <BottomSheet.Trigger className="LearnMore-closeButton" action="dismiss">
                  Close
                </BottomSheet.Trigger>
              </BottomSheet.Content>
            </BottomSheet.View>
          </BottomSheet.Portal>
        </BottomSheet.Root>
        
        <BottomSheet.Root>
          <BottomSheet.Trigger asChild>
            <RippleButton className="text-white font-bold  lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg" rippleColor='#fff'>
              Donate
            </RippleButton>
          </BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.View>
              <BottomSheet.Backdrop />
              <BottomSheet.Content className="Donate-content">
                <BottomSheet.Handle className="Donate-handle" />
                <div className="Donate-icon">
                  <Heart size={80} strokeWidth={2} fill='red'/>
                </div>
                <div className="Donate-information">
                  <BottomSheet.Title className="Donate-title">
                    Support iconly
                  </BottomSheet.Title>
                  <BottomSheet.Description className="flex flex-row text-pretty text-left text-gray-500 font-semibold w-[300px]">
                    Your support helps us keep iconly free and accessible for everyone. Every contribution goes directly to improving the service and adding new features.
                  </BottomSheet.Description>
                </div>
                <div className="Donate-options">
                  <button className="Donate-option-button">
                    <span className="Donate-option-amount">$5</span>
                    <span className="Donate-option-label">Coffee</span>
                  </button>
                  <button className="Donate-option-button">
                    <span className="Donate-option-amount">$10</span>
                    <span className="Donate-option-label">Lunch</span>
                  </button>
                  <button className="Donate-option-button">
                    <span className="Donate-option-amount">$25</span>
                    <span className="Donate-option-label">Dinner</span>
                  </button>
                </div>
                <BottomSheet.Trigger className="Donate-closeButton" action="dismiss">
                  Maybe Later
                </BottomSheet.Trigger>
              </BottomSheet.Content>
            </BottomSheet.View>
          </BottomSheet.Portal>
        </BottomSheet.Root>

        </div>
        
        
      </div>
      <InfiniteGrid onImageClick={handleImageClick} animationType="polkadot" disableCustomScroll={false} />
      
      {selectedImage && (
        <div 
          className={`modal-backdrop fixed pt-12 inset-0 flex flex-col overflow-y-auto p-4 items-center z-50 bg-white ${isExiting ? 'modal-exiting' : ''}`}
          style={{
            pointerEvents: isExiting ? 'none' : 'auto'
          }}
          onClick={handleCloseModal}
          onAnimationEnd={handleAnimationEnd}
        >
          {/* The Image in the expanded view */}
          <div 
            className={`modal-image relative mb-6 min-h-[200px] w-full transition-all duration-600 ease-out ${isExiting ? 'modal-image-exit' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              pointerEvents: isExiting ? 'none' : 'auto'
            }}
          >
            <img 
              src={selectedImage.url} 
              alt={`Image ${selectedImage.row}-${selectedImage.col}`}
              draggable="false"
              className="mx-auto w-full max-w-[280px] h-full rounded-2xl object-contain"
            />
          </div>
          
          {/* The lorem ipsum section / description of the image  */}
          <div 
            className={`modal-content flex w-[300px] flex-col justify-center p-4 text-black transition-all duration-700 ease-out ${isExiting ? 'modal-content-exit' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              pointerEvents: isExiting ? 'none' : 'auto'
            }}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">photography</span>
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">nature</span>
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">landscape</span>
            </div>
            
            <h2 className="mb-2 text-3xl font-bold">Beautiful Image</h2>
            <div className="mb-4 text-lg text-black/90"></div>
            <p className="text-base text-black/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            
            {/* The download and go back button */}
            <div 
              className={`modal-actions flex w-full gap-4 py-5 items-center justify-center transition-all duration-700 ease-out ${isExiting ? 'modal-actions-exit' : ''}`}
              style={{
                pointerEvents: isExiting ? 'none' : 'auto'
              }}
            >
              <RippleButton 
                className="bg-black w-[120px] rounded-full text-white border-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
              >
                <span>Back</span>
              </RippleButton>
              
              <RippleButton className="bg-black w-[120px] rounded-full text-white border-none">
                <span>Download</span>
              </RippleButton>
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
      )}
      <Analytics />
    </div>
  );
}

export default App
