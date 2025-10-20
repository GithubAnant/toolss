import  InfiniteGrid  from './InfiniteGrid'
import { RippleButton } from './components/magicui/ripple-button';
import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BottomSheet } from './components/BottomSheet';
import './components/BottomSheet.css';
import { Info } from 'lucide-react';

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
  const [starCount, setStarCount] = useState<number | null>(null);

  // GitHub icon component
  const GitHubIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );

  // Fetch GitHub stars
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/GithubAnant/toolss');
        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error('Failed to fetch star count:', error);
        setStarCount(0);
      }
    };

    fetchStars();
  }, []);

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
          toolss
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
                    About Toolss
                  </BottomSheet.Title>
                  <BottomSheet.Description className="flex flex-row text-pretty text-left text-gray-500 font-semibold w-[300px]">
                    Toolss is an AI-powered icon generator that creates beautiful, unique icons instantly.
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
            <RippleButton className="text-white font-bold lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg" rippleColor='#fff'>
              Support
            </RippleButton>
          </BottomSheet.Trigger>
          <BottomSheet.Portal>
            <BottomSheet.View>
              <BottomSheet.Backdrop />
              <BottomSheet.Content className="Support-content">
                <BottomSheet.Handle className="Support-handle" />
                <div className="Support-icon">
                  <GitHubIcon size={80} className="text-gray-900"/>
                </div>
                <div className="Support-information">
                  <BottomSheet.Title className="Support-title">
                    Star Our Repository
                  </BottomSheet.Title>
                  <BottomSheet.Description className="flex flex-row text-pretty text-left text-gray-500 font-semibold w-[300px]">
                    Help us grow by starring our GitHub repository! Your star helps other developers discover toolss and motivates us to keep improving.
                  </BottomSheet.Description>
                </div>
                <div className="Support-actions">
                  <button 
                    onClick={() => window.open('https://github.com/GithubAnant/toolss', '_blank')}
                    className="Support-star-button bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105"
                  >
                    <GitHubIcon size={16}/>
                    <span>
                      {starCount !== null ? `${starCount} Stars` : 'Star on GitHub'}
                    </span>
                  </button>
                </div>
                <BottomSheet.Trigger className="Support-closeButton" action="dismiss">
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
