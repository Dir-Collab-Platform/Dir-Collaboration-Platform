import { useState, useEffect, useCallback, useContext } from 'react';
import Header from "../../common-components/Header/Header";
import Footer from "../../common-components/Footer/Footer";
import ExploreHero from "./components/ExploreHero";
import TagList from "./components/TagList";
import ProjectGrid from "./components/ProjectGrid";
import { ExploreContext } from '../../context/ExploreContext/ExploreContext';
import ExploreProvider from '../../context/ExploreContext/ExploreProvider';

function ExploreContainerContent() {
  const { repos, setRepos, tags, setTags, searchRepos, isLoading, handleCreateTag } = useContext(ExploreContext);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFetching, setIsFetching] = useState(false);

  // Core Data Loader
  const loadData = useCallback(async (pageNum, currentFilter, currentTag, currentSearch, append = false) => {
    setIsFetching(true);
    try {
      const res = await searchRepos(currentSearch, currentFilter, currentTag, pageNum);

      if (res.status === 'success') {
        const newRepos = res.data.repos || [];

        setRepos(prev => {
          if (!append) return newRepos; // Fresh load for filters/tags/search

          // Deduplicate using githubId (unique for all repos)
          const map = new Map(prev.map(repo => [repo.githubId, repo]));
          newRepos.forEach(repo => map.set(repo.githubId, repo));
          return Array.from(map.values());
        });

        setHasNextPage(res.data.hasNextPage);
      }
    } catch (error) {
      console.error('Failed to load explore data:', error);
    } finally {
      setIsFetching(false);
    }
  }, [searchRepos, setRepos]);

  // Handle Search Submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    // Trigger fresh search with current query state
    loadData(1, filter, selectedTag, searchQuery, false);
  };

  // FIX: Reset page and fresh load ONLY when filters or tags change
  useEffect(() => {
    setPage(1);
    // Persist current search query when filtering
    loadData(1, filter, selectedTag, searchQuery, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, selectedTag]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    // Append next page with current search query
    loadData(nextPage, filter, selectedTag, searchQuery, true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-8 bg-(--dark-bg) text-(--primary-text-color)">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <ExploreHero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>
          <div className="mb-10">
            <TagList
              tags={tags}
              setTags={setTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
          </div>
          <ProjectGrid
            repos={repos}
            onLoadMore={handleLoadMore}
            isLoading={isLoading || isFetching}
            showButton={hasNextPage}
            activeFilter={filter}
            onFilterChange={setFilter}
            onAddTag={handleCreateTag}
            onTagClick={setSelectedTag}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

const ExploreContainer = () => {
  return (
    <ExploreProvider>
      <ExploreContainerContent />
    </ExploreProvider>
  );
};

export default ExploreContainer;