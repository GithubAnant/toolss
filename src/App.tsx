import  InfiniteGrid  from './InfiniteGrid'
import { RippleButton } from './components/magicui/ripple-button';
import { useState } from 'react';

interface SelectedImage {
  url: string;
  row: number;
  col: number;
}

// Note: I created descriptions of the divs/their purpose, the styling is mostly in tailwind only
// This is just to help me keep track what div does what without having to create a react arrow function
function App() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const handleImageClick = (imageData: SelectedImage) => {
    setSelectedImage(imageData);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
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

        <RippleButton className="text-white font-bold lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg" rippleColor='#fff'>
          Learn More
        </RippleButton>
        <RippleButton className="text-white font-bold  lowercase w-[120px] h-[50px] flex line-clamp-1 justify-center items-center bg-black/30 rounded-full p-0! border-none backdrop-blur-lg" rippleColor='#fff'>
          Donate
        </RippleButton>

        </div>
        
        
      </div>
      <InfiniteGrid onImageClick={handleImageClick} />
      
      {selectedImage && (
        <div className="fixed   inset-0 flex flex-col overflow-y-auto p-4 items-center bg-white/50 backdrop-blur-sm z-50">
          <div className="absolute bottom-12  z-10 flex gap-2 ">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 w-9 rounded-full p-2 transition-colors bg-black/10 text-black/80 hover:bg-black/20" aria-label="Play audio">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 w-9 rounded-full p-2 transition-colors bg-black/10 text-black/80 hover:bg-black/20" aria-label="Share">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 w-9 rounded-full p-2 transition-colors bg-black/10 text-black/80 hover:bg-black/20" 
              aria-label="Close"
              onClick={handleCloseModal}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="relative mb-6 min-h-[200px] w-full ">
            <img 
              src={selectedImage.url} 
              alt={`Image ${selectedImage.row}-${selectedImage.col}`}
              draggable="false"
              className="mx-auto w-full max-w-[280px] h-full rounded-2xl object-contain"
            />
          </div>
          
          <div className="flex w-[300px]  flex-col justify-center p-4 text-black ">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">photography</span>
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">nature</span>
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">landscape</span>
            </div>
            
            <h2 className="mb-2 text-3xl font-bold ">Beautiful Image</h2>
            <div className="mb-4 text-lg text-black/90 "></div>
            <p className="text-base text-black/80 ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            
            <div className="flex w-full gap-4 py-5 items-center justify-center ">
              <RippleButton 
                className="bg-black w-[120px] rounded-full text-white border-none"
                onClick={handleCloseModal}
              >
                <span className="">Back</span>
              </RippleButton>
              
              <RippleButton className="bg-black w-[120px] rounded-full text-white border-none">
                <span className="">Download</span>
              </RippleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
