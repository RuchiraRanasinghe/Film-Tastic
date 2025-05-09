
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import type { Movie } from '../services/tmdb';
import tmdbApi from '../services/tmdb';
import { useMovies } from '../contexts/MovieContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  const posterUrl = tmdbApi.getImageUrl(movie.poster_path);
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Calculate year from release date
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  
  return (
    <Link to={`/movie/${movie.id}`} className={`block transition-transform hover:scale-[1.01] focus:outline-none ${className}`}>
      <Card className="movie-card overflow-hidden h-full flex flex-col group">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-3">
            <div className="text-white font-medium text-truncate">{movie.title}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-gray-300 text-sm">{releaseYear}</div>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-200 text-sm ml-1">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-2 right-2 rounded-full bg-background/70 backdrop-blur-sm ${
              isFavorite(movie.id) ? 'bg-accent text-accent-foreground' : 'bg-background/70'
            } hover:bg-accent/80`}
            onClick={handleFavoriteToggle}
            aria-label={isFavorite(movie.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path
                d="M7.5 1.5L9.32 5.24L13.5 5.88L10.5 8.76L11.28 13L7.5 10.92L3.72 13L4.5 8.76L1.5 5.88L5.68 5.24L7.5 1.5Z"
                fill={isFavorite(movie.id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default MovieCard;
