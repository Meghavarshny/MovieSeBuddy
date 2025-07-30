import React from 'react';
import { AlertCircle, Search, Film } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import { Movie } from '@/services/omdbApi';

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onMovieClick: (imdbID: string) => void;
  onRetry?: () => void;
  searchQuery?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  error,
  currentPage,
  totalResults,
  onPageChange,
  onMovieClick,
  onRetry,
  searchQuery = ''
}) => {
  const moviesPerPage = 1
  const totalPages = Math.ceil(totalResults / moviesPerPage);

  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden border border-border"
            >
              <div className="aspect-[2/3] bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Alert className="max-w-md border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="mt-4"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  
  if (movies.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Results Found
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          We couldn't find any movies matching "{searchQuery}". 
          Try adjusting your search terms or check the spelling.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Suggestions:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Check your spelling</li>
            <li>• Try different keywords</li>
            <li>• Use fewer or more general terms</li>
            <li>• Try changing the type filter</li>
          </ul>
        </div>
      </div>
    );
  }

  
  if (movies.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Film className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Start Your Movie Search
        </h3>
        <p className="text-muted-foreground">
          Enter a movie title, TV show, or keyword above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {movies.length} of {totalResults.toLocaleString()} results
          {searchQuery && (
            <span> for "{searchQuery}"</span>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>

      {}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalResults={totalResults}
        />
      )}
    </div>
  );
};

export default MovieGrid;