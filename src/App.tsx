import  InfiniteGrid  from './InfiniteGrid'
import { RippleButton } from './components/magicui/ripple-button';

// Note: I created descriptions of the divs/their purpose, the styling is mostly in tailwind only
// This is just to help me keep track what div does what without having to create a react arrow function
function App() {

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
      <InfiniteGrid />
    </div>
  );
}

export default App
