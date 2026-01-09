import SearchBar from "./SearchBar";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExploreHero = ({ searchQuery, setSearchQuery, onSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center relative">
      <div className="absolute right-0 top-0 hidden md:block">
        <button
          onClick={() => navigate('/repository/create')}
          className="flex items-center gap-2 bg-(--primary-button) hover:bg-(--primary-button-hover) text-white px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg"
        >
          <Plus size={18} />
          <span>New Repository</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <Search className="stroke-2 w-9 h-9" />
        <h1 className="text-4xl font-semibold ml-4">Explore</h1>
      </div>
      <p className="text-(--primary-text-color) mb-6 font-light">
        Find the best projects out there and contribute. Make the world a better place.
      </p>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
        className="flex justify-center items-center"
      />

      <div className="mt-4 md:hidden">
        <button
          onClick={() => navigate('/repository/create')}
          className="flex items-center gap-2 bg-(--primary-button) hover:bg-(--primary-button-hover) text-white px-4 py-2 rounded-lg transition-all mx-auto shadow-lg"
        >
          <Plus size={18} />
          <span>New Repository</span>
        </button>
      </div>
    </div>
  );
};

export default ExploreHero;