
import React, { createContext, useContext, useState, useEffect } from 'react';
import tmdbApi, { type Movie, type MoviesResponse } from '../services/tmdb';

interface MovieContextType {
  trendingMovies: Movie[];
  searchResults: Movie[];
  favorites: Movie[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  searchMovies: (query: string) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  clearSearch: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Load last search query from localStorage
    const lastSearch = localStorage.getItem('lastSearchQuery');
    if (lastSearch) {
      setSearchQuery(lastSearch);
      searchMovies(lastSearch);
    } else {
      // If no last search, load trending movies
      loadTrendingMovies();
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Load trending movies
  const loadTrendingMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tmdbApi.getTrending('week');
      setTrendingMovies(response.results);
    } catch (err) {
      setError('Failed to load trending movies. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search movies
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    localStorage.setItem('lastSearchQuery', query);
    
    try {
      const response = await tmdbApi.searchMovies(query);
      setSearchResults(response.results);
      setCurrentPage(1);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Failed to search movies. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more search results
  const loadMoreMovies = async () => {
    if (isLoading || currentPage >= totalPages) return;
    
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await tmdbApi.searchMovies(searchQuery, nextPage);
      setSearchResults(prev => [...prev, ...response.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError('Failed to load more movies. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search results
  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
    localStorage.removeItem('lastSearchQuery');
  };

  // Add movie to favorites
  const addToFavorites = (movie: Movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  // Remove movie from favorites
  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  // Check if movie is in favorites
  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const hasMore = currentPage < totalPages;

  return (
    <MovieContext.Provider value={{
      trendingMovies,
      searchResults,
      favorites,
      searchQuery,
      isLoading,
      error,
      hasMore,
      currentPage,
      totalPages,
      searchMovies,
      loadMoreMovies,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearSearch
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
