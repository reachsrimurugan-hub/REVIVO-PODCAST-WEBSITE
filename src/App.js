import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PodcastList from './pages/PodcastList';
import PodcastDetail from './pages/PodcastDetail';
import SearchResults from './pages/SearchResults';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('revivo_theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('revivo-dark', isDark);
    localStorage.setItem('revivo_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onToggleTheme={() => setIsDark(v => !v)} isDark={isDark} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podcasts" element={<PodcastList />} />
          <Route path="/podcasts/:id" element={<PodcastDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;


