// ExploreHero.jsx
import SearchBar from "./SearchBar";
import { Search } from "lucide-react";

const ExploreHero = () => (
  <div className="text-center ">
    <div className="flex items-center justify-center gap-2 mb-4">
      <Search className="stroke-2 w-9 h-9" />
      <h1 className="text-4xl font-semibold ml-4">Explore</h1>
    </div>
    <p className="text-(--primary-text-color) mb-6 font-light">
      Find the best projects out there and contribute. Make the world a better place.
    </p>
    <SearchBar className="flex justify-center items-center"/>
  </div>
);

export default ExploreHero ;