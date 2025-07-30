import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Film, Sparkles } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import { searchMovies, Movie } from '@/services/omdbApi';
import { useToast } from '@/hooks/use-toast';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Get initial values from URL params
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialPageParam = searchParams.get('page');
  const initialPage = initialPageParam ? parseInt(initialPageParam, 10) : 1;

  // Perform search function
  const performSearch = useCallback(async (
    query: string, 
    type: string = 'all', 
    page: number = 1,
    showToast: boolean = false
  ) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await searchMovies(query, page, type);
      
      if (data.Response === 'False') {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || 'No movies found');
        if (showToast) {
          toast({
            title: "No Results",
            description: data.Error || 'No movies found for your search.',
            variant: "destructive",
          });
        }
      } else {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults, 10));
        setCurrentPage(page);
        setHasSearched(true);
        
        if (showToast && data.Search?.length) {
          toast({
            title: "Search Successful",
            description: `Found ${data.totalResults} results for "${query}".`,
          });
        }
      }
      
      // Update URL with search parameters
      const newParams = new URLSearchParams();
      newParams.set('q', query);
      if (type !== 'all') newParams.set('type', type);
      if (page > 1) newParams.set('page', page.toString());
      setSearchParams(newParams);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search movies';
      setError(errorMessage);
      setMovies([]);
      setTotalResults(0);
      
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setSearchParams, toast]);

  // Load initial search if URL has parameters
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialType, initialPage);
    }
  }, []); // Empty dependency array - only run once on mount

  // Handle new search from search bar
  const handleSearch = (query: string, type: string) => {
    setCurrentPage(1);
    performSearch(query, type, 1, true);
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    performSearch(query, type, newPage, false);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle movie card click
  const handleMovieClick = (imdbID: string) => {
    navigate(`/movie/${imdbID}`);
  };

  // Retry search
  const handleRetry = () => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    performSearch(query, type, page, true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Film className="h-10 w-10 text-primary" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                CineSearch
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover millions of movies, TV shows, and episodes. Search by title, actor, director, or keyword.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            initialQuery={initialQuery}
            initialType={initialType}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalResults={totalResults}
          onPageChange={handlePageChange}
          onMovieClick={handleMovieClick}
          onRetry={handleRetry}
          searchQuery={searchParams.get('q') || ''}
        />

        {/* Featured searches - shown when no search performed */}
        {!hasSearched && !loading && (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Popular Searches
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                'Marvel Movies',
                'Christopher Nolan',
                'Breaking Bad', 
                'The Office'
              ].map((searchTerm) => (
                <button
                  key={searchTerm}
                  onClick={() => handleSearch(searchTerm, 'all')}
                  className="p-4 bg-card border border-border rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <div className="font-medium text-foreground">{searchTerm}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a 
              href="http://www.omdbapi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OMDb API
            </a>
            {' '}• Movie data provided by IMDb
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;