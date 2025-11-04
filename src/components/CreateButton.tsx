import { useNavigate } from "react-router-dom";

export function CreateButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/submit")}
      className="bg-black/30 hover:bg-black/70 rounded-full px-6 py-3 text-white/70 font-bold text-xs whitespace-nowrap transition-all backdrop-blur-lg hover:text-white duration-200 ease-in-out cursor-pointer"
    >
      + Upload a Tool
    </button>
  );
}
