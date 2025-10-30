import { useNavigate } from "react-router-dom";

export function CreateButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/submit")}
      className="bg-black/50 hover:bg-black/70 rounded-full px-6 py-2.5 text-white font-bold text-sm whitespace-nowrap transition-all"
    >
      + Upload a Tool
    </button>
  );
}
