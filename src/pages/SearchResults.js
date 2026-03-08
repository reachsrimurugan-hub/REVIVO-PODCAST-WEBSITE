import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPodcasts } from '../services/api';
import PodcastCard from '../components/PodcastCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: 'relevance' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const q = query.get('q') || '';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPodcasts();
        // Filter podcasts based on title search
        const filtered = data.filter(podcast => 
          podcast.title.toLowerCase().includes(q.toLowerCase())
        );
        setItems(filtered);
      } catch (error) {
        console.error('Error searching podcasts:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const filtered = useMemo(() => {
    const list = [...items];
    if (filters.sort === 'rating_desc') list.sort((a,b) => b.rating - a.rating);
    if (filters.sort === 'date_desc') list.sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    return list;
  }, [items, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPodcasts = filtered.slice(startIndex, endIndex);

  // Reset to first page when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [q, filters]);

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Searching...</span>
        </div>
        <p className="mt-2">Searching for "{q}"...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4>Search results for "{q}"</h4>
      
      {items.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fa-solid fa-search fa-3x text-muted"></i>
          </div>
          <h5 className="text-muted">No podcasts found</h5>
          <p className="text-muted">We couldn't find any podcasts matching "{q}"</p>
          <p className="text-muted small">Try searching with different keywords or browse our podcast collection</p>
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center gap-2 mb-3">
            <label className="form-label small mb-0">Sort</label>
            <select className="form-select w-auto" value={filters.sort} onChange={e => setFilters({ sort: e.target.value })}>
              <option value="relevance">Relevance</option>
              <option value="rating_desc">Rating</option>
              <option value="date_desc">Newest</option>
            </select>
          </div>
          <div className="row g-3">
            {paginatedPodcasts.map(p => (
              <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                <PodcastCard podcast={p} />
              </div>
            ))}
          </div>

          {/* Pagination - Only show if there are more than 12 items */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Search results pagination">
                <ul className="pagination">
                  {/* Previous button */}
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="fa-solid fa-chevron-left"></i> Previous
                    </button>
                  </li>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <li key={pageNum} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}

                  {/* Next button */}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          {/* Show current page info */}
          {totalPages > 1 && (
            <div className="text-center text-muted mt-2">
              Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} results
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;