// SearchBar.jsx
import { Search } from 'lucide-react';

const SearchBar = () => (
  <div className="flex justify-center max-w-xl mx-auto bg-(--card-bg-lighter) rounded-full border border-(--main-border-color) overflow-hidden ">
    <input
      type="text"
      placeholder="Search for Repositories, Workspaces..."
      className="flex-1 bg-transparent px-5 py-3 text-sm outline-none h-8"
    />
    <button className="bg-(--primary-button) hover:bg-(--primary-button-hover) px-6 text-sm flex items-center justify-center gap-2 w-25">
      <Search size={16} />
      Search
    </button>
  </div>
);

export default SearchBar;