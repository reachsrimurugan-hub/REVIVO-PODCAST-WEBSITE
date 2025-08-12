async function fetchTrending() {
    const res = await fetch('/api/trending');
    const data = await res.json();
    displayPodcasts(data.podcasts || []);
  }
  
  async function searchPodcasts(query) {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    displayPodcasts(data.results || []);
  }
  
  function displayPodcasts(podcasts) {
    const list = document.getElementById('podcast-list');
    list.innerHTML = '';
  
    podcasts.forEach(podcast => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${podcast.image}" alt="${podcast.title}" />
        <h3>${podcast.title}</h3>
        ${podcast.audio ? `<audio controls src="${podcast.audio}"></audio>` : ''}
      `;
      list.appendChild(card);
    });
  }
  
  document.getElementById('search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      searchPodcasts(query);
    }
  });
  
  fetchTrending();
  
  
