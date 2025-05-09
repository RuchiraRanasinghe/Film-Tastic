
import React from 'react';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/MovieGrid';

const FavoritesPage: React.FC = () => {
  const { favorites } = useMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      
      <MovieGrid 
        movies={favorites}
        emptyMessage="You haven't added any movies to your favorites yet"
      />
    </div>
  );
};

export default FavoritesPage;
