
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useMovies } from '../contexts/MovieContext';
import tmdbApi, { type MovieDetails, type Cast, type Video } from '../services/tmdb';
import { Separator } from '../components/ui/separator';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!movieId) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Load movie details
        const movieData = await tmdbApi.getMovieDetails(movieId);
        setMovie(movieData);

        // Load cast
        const creditsData = await tmdbApi.getMovieCredits(movieId);
        setCast(creditsData.cast.slice(0, 10)); // Get top 10 cast members

        // Load videos (trailers)
        const videosData = await tmdbApi.getMovieVideos(movieId);
        setVideos(videosData.results.filter(video => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
        ).slice(0, 3)); // Get top 3 trailers
      } catch (err) {
        console.error('Error loading movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId, navigate]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-80 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || 'Movie not found'}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const backdropUrl = tmdbApi.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdbApi.getImageUrl(movie.poster_path);

  // Find YouTube trailer if available
  const trailer = videos.find(video => video.type === 'Trailer') || videos[0];

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-[30vh] pb-12 relative z-1">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="hidden md:block rounded-lg overflow-hidden shadow-2xl">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Movie info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-muted-foreground mt-2 italic">{movie.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">★</span>
                <span className="font-medium text-foreground">{movie.vote_average.toFixed(1)}</span>
                <span className="text-sm ml-1">({movie.vote_count} votes)</span>
              </div>

              {movie.release_date && (
                <div>
                  {new Date(movie.release_date).getFullYear()}
                </div>
              )}

              {movie.runtime > 0 && (
                <div>
                  {formatRuntime(movie.runtime)}
                </div>
              )}

              {/* Add to favorites button */}
              <Button
                variant={isFavorite(movie.id) ? "default" : "outline"}
                className="ml-auto"
                onClick={handleFavoriteToggle}
              >
                {isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>

            {cast.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Cast</h3>
                <div className="flex overflow-x-auto gap-4 pb-2 -mx-2 px-2">
                  {cast.map(person => (
                    <div key={person.id} className="flex-shrink-0 w-[100px]">
                      <div className="rounded-md overflow-hidden bg-muted aspect-[2/3]">
                        {person.profile_path ? (
                          <img
                            src={tmdbApi.getImageUrl(person.profile_path, 'w200')}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-2">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium mt-1 text-truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground text-truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Trailer</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movie.title} trailer`}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
