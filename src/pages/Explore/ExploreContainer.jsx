import { useState, useEffect, useCallback } from 'react';
import Header from "../../common-components/Header/Header";
import Footer from "../../common-components/Footer/Footer";
import ExploreHero from "./components/ExploreHero";
import TagList from "./components/TagList";
import ProjectGrid from "./components/ProjectGrid";
import { fetchExploreRepos, fetchTopics } from "./api/repoService";

const ExploreContainer = () => {
  const [repos, setRepos] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // 'all', 'repository', or 'workspace'
  const [hasNextPage, setHasNextPage] = useState(true);

  // Fetch data function
  const loadData = useCallback(async (pageNum, currentFilter, append = false) => {
    setLoading(true);
    const res = await fetchExploreRepos(pageNum, currentFilter);
    
    if (append) {
      setRepos(prev => [...prev, ...res.data.repos]);
    } else {
      setRepos(res.data.repos);
    }
    
    setHasNextPage(res.data.hasNextPage);
    setLoading(false);
  }, []);

  // Initial Load & Filter Changes
  useEffect(() => {
    const init = async () => {
      const tagRes = await fetchTopics();
      setTags(tagRes.data);
      loadData(1, filter, false);
      setPage(1);
    };
    init();
  }, [filter, loadData]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    loadData(nextPage, filter, true);
    setPage(nextPage);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-dark-bg text-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6"><ExploreHero /></div>
          <div className="mb-10"><TagList tags={tags} setTags={setTags} /></div>
          <ProjectGrid 
            repos={repos} 
            onLoadMore={handleLoadMore} 
            isLoading={loading}
            showButton={hasNextPage}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExploreContainer;