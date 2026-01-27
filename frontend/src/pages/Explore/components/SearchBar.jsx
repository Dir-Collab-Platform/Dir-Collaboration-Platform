import { Search, Loader2 } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, className, isLoading }) => (
  <form
    onSubmit={onSearch}
    className={`flex items-stretch max-w-2xl mx-auto bg-(--bg-card) rounded-xl border border-(--border-main) overflow-hidden focus-within:ring-2 focus-within:ring-(--text-active)/30 transition-shadow ${className || ''}`}
  >
    <div className="flex items-center pl-5 text-(--text-dim)">
      <Search size={18} />
    </div>
    <input
      type="text"
      placeholder="Search for repositories, topics..."
      disabled={isLoading}
      className="flex-1 bg-transparent px-4 py-3.5 text-base outline-none text-(--text-primary) placeholder:text-(--text-dim)/50 disabled:opacity-50"
      value={searchQuery || ""}
      onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
    />
    <button
      type="submit"
      disabled={isLoading}
      className="bg-(--button-primary) hover:bg-(--button-primary-hover) px-8 text-base font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed min-w-32"
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        "Search"
      )}
    </button>
  </form>
);

export default SearchBar;