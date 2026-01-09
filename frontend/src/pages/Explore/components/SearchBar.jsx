import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, className }) => (
  <form
    onSubmit={onSearch}
    className={`flex justify-center max-w-xl mx-auto bg-(--card-bg-lighter) rounded-full border border-(--main-border-color) overflow-hidden ${className || ''}`}
  >
    <input
      type="text"
      placeholder="Search for Repositories, Workspaces..."
      className="flex-1 bg-transparent px-5 py-3 text-sm outline-none h-auto md:h-12 text-(--primary-text-color)"
      value={searchQuery || ""}
      onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
    />
    <button
      type="submit"
      className="bg-(--primary-button) hover:bg-(--primary-button-hover) px-6 text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
    >
      <Search size={16} />
      Search
    </button>
  </form>
);

export default SearchBar;