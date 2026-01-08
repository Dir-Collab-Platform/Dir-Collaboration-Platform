import { useState, useEffect, useCallback, useContext } from 'react';
import Header from "../../common-components/Header/Header";
import Footer from "../../common-components/Footer/Footer";
import ExploreHero from "./components/ExploreHero";
import TagList from "./components/TagList";
import ProjectGrid from "./components/ProjectGrid";
import { ExploreContext } from '../../context/ExploreContext/ExploreContext';
import ExploreProvider from '../../context/ExploreContext/ExploreProvider';

function ExploreContainerContent() {
  const { repos, tags, searchRepos, isLoading } = useContext(ExploreContext);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [displayRepos, setDisplayRepos] = useState([]);

  // Fetch data function
  const loadData = useCallback(async (pageNum, currentFilter, currentTag, append = false) => {
    try {
      const res = await searchRepos("", currentFilter, currentTag, pageNum);
      
      if (append) {
        setDisplayRepos(prev => [...prev, ...res.data.repos]);
      } else {
        setDisplayRepos(res.data.repos);
      }

      setHasNextPage(res.data.hasNextPage);
    } catch (error) {
      console.error('Failed to load explore data:', error);
    }
  }, [searchRepos]);

  // Initial Load & Filter Changes
  useEffect(() => {
    loadData(1, filter, selectedTag, false);
    setPage(1);
  }, [filter, selectedTag, loadData]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    loadData(nextPage, filter, selectedTag, true);
    setPage(nextPage);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-8 bg-(--dark-bg) text-(--primary-text-color)">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <ExploreHero />
          </div>
          <div className="mb-10">
            <TagList 
              tags={tags} 
              setTags={() => {}} 
              selectedTag={selectedTag} 
              setSelectedTag={setSelectedTag} 
            />
          </div>
          <ProjectGrid 
            repos={displayRepos} 
            onLoadMore={handleLoadMore} 
            isLoading={isLoading}
            showButton={hasNextPage}
            activeFilter={filter}
            onFilterChange={setFilter}
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
