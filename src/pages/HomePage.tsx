
import React from 'react';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../contexts/MovieContext';

const HomePage: React.FC = () => {
  const { 
    trendingMovies, 
    searchResults, 
    searchQuery,
    isLoading, 
    error, 
    hasMore, 
    loadMoreMovies
  } = useMovies();

  // If there's a search query, show search results, otherwise show trending movies
  const displayMovies = searchQuery ? searchResults : trendingMovies;
  const title = searchQuery ? `Results for "${searchQuery}"` : 'Trending Movies';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      
      <MovieGrid 
        movies={displayMovies}
        loading={isLoading}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMoreMovies}
        emptyMessage={searchQuery ? `No results found for "${searchQuery}"` : "No trending movies available"}
      />
    </div>
  );
};

export default HomePage;
