
import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/services/tmdb';
import { Button } from '@/components/ui/button';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  emptyMessage = "No movies found"
}) => {
  // Handle empty state
  if (!loading && movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h3 className="text-2xl font-bold mb-2">¯\_(ツ)_/¯</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        
        {/* Loading placeholders */}
        {loading &&
          [...Array(4)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-muted animate-pulse aspect-[2/3] rounded-lg"
            />
          ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center p-4 text-destructive">
          <p>{error}</p>
        </div>
      )}

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
