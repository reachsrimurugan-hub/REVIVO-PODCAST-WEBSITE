import React, { useEffect, useMemo, useState } from 'react';
import { fetchPodcasts } from '../services/api';
import PodcastCard from '../components/PodcastCard';

const uniqueValues = (items, key) => Array.from(new Set(items.map(i => i[key]).filter(Boolean)));

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({ category: '', language: '', sort: 'rating_desc', minRating: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPodcasts();
        setPodcasts(data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setPodcasts([]);
      }
    })();
  }, []);

  const categories = useMemo(() => uniqueValues(podcasts, 'category'), [podcasts]);
  const languages = useMemo(() => uniqueValues(podcasts, 'language'), [podcasts]);

  const filtered = useMemo(() => {
    let list = [...podcasts];
    if (filters.category) list = list.filter(p => p.category === filters.category);
    if (filters.language) list = list.filter(p => p.language === filters.language);
    if (filters.minRating) list = list.filter(p => p.rating >= Number(filters.minRating));
    if (filters.sort === 'rating_desc') list.sort((a,b) => b.rating - a.rating);
    if (filters.sort === 'date_desc') list.sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    return list;
  }, [podcasts, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPodcasts = filtered.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
        <div>
          <label className="form-label small">Category</label>
          <select className="form-select" value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))}>
            <option value="">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label small">Language</label>
          <select className="form-select" value={filters.language} onChange={e => setFilters(f => ({...f, language: e.target.value}))}>
            <option value="">All</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label small">Min Rating</label>
          <select className="form-select" value={filters.minRating} onChange={e => setFilters(f => ({...f, minRating: e.target.value}))}>
            <option value="">Any</option>
            {[5,4.5,4,3.5,3].map(r => <option key={r} value={r}>{r}+</option>)}
          </select>
        </div>
        <div>
          <label className="form-label small">Sort</label>
          <select className="form-select" value={filters.sort} onChange={e => setFilters(f => ({...f, sort: e.target.value}))}>
            <option value="rating_desc">Rating</option>
            <option value="date_desc">Newest</option>
          </select>
        </div>
        <div className="ms-auto d-flex gap-2">
          <button className={`btn btn-outline-secondary ${view==='grid'?'active':''}`} onClick={()=>setView('grid')}><i className="fa-solid fa-table-cells"></i></button>
          <button className={`btn btn-outline-secondary ${view==='list'?'active':''}`} onClick={()=>setView('list')}><i className="fa-solid fa-list"></i></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="row g-3">
          {paginatedPodcasts.map(p => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-4">
              <PodcastCard podcast={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-group">
          {paginatedPodcasts.map(p => (
            <div key={p.id} className="list-group-item list-group-item-action d-flex align-items-center">
              <img src={p.thumbnailUrl} alt={p.title} width={56} height={56} className="rounded me-3" />
              <div className="flex-grow-1">
                <div className="fw-semibold">{p.title} <span className="badge bg-secondary ms-2">{p.badge || 'Featured'}</span></div>
                <div className="text-muted small">{p.host} · {p.category} · {p.language}</div>
              </div>
              <div className="text-warning me-3"><i className="fa-solid fa-star"></i> {p.rating}</div>
              <a className="btn btn-sm btn-primary" href={`/podcasts/${p.id}`}>View</a>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - Only show if there are more than 12 items */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Podcast pagination">
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
          Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} podcasts
        </div>
      )}
    </div>
  );
};

export default PodcastList;