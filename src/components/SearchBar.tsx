export function SearchBar() {
  return (
    <div className="w-[15%]">
      <input
        type="text"
        placeholder="search an icon..."
        className="w-full px-4 py-2.5 bg-black/30 backdrop-blur-lg rounded-full text-white placeholder-white/70 border-none outline-none focus:bg-black/40 transition-all text-sm"
      />
    </div>
  );
}
