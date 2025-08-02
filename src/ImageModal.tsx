import { RippleButton } from './components/magicui/ripple-button';

interface SelectedImage {
  url: string;
  row: number;
  col: number;
}

interface ImageModalProps {
  selectedImage: SelectedImage;
  onClose: () => void;
}

const ImageModal = ({ selectedImage, onClose }: ImageModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out"
      style={{
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
      onClick={onClose}
    >
      <div 
        className="w-[330px] max-w-full flex flex-row bg-[#FEFCF7] rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-out"
        style={{
          animation: 'slideUp 0.3s ease-out forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top action buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
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
            onClick={onClose}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Image section - left half */}
        <div className="relative w-1/2 min-h-[300px]">
          <img 
            src={selectedImage.url} 
            alt={`Image ${selectedImage.row}-${selectedImage.col}`}
            draggable="false"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content section - right half */}
        <div className="flex w-1/2 flex-col justify-center p-4 text-black">
          <div className="mb-3 flex flex-wrap gap-1">
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">photo</span>
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-normal border-black/30 bg-black/10 text-black/80 cursor-pointer">nature</span>
          </div>
          
          <h2 className="mb-2 text-lg font-bold">Beautiful Image</h2>
          <p className="text-xs text-black/80 mb-4 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          
          <div className="flex flex-col gap-2">
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0 shadow h-8 w-full rounded-full px-4 py-2 transition-colors bg-black text-white hover:bg-gray-800"
              onClick={onClose}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Grid
            </button>
            
            <RippleButton className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0 shadow h-8 w-full rounded-full px-4 py-2 transition-colors bg-black text-white hover:bg-gray-800">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Image
            </RippleButton>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageModal;