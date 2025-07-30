// OMDB API integration service
// Note: In production, store API key securely
const API_KEY = '308a925d'; // Your OMDB API key
const BASE_URL = 'https://www.omdbapi.com/';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetailsResponse extends MovieDetails {
  Response: string;
  Error?: string;
}

// Movie search with pagination and type filtering
export const searchMovies = async (
  query: string, 
  page: number = 1, 
  type?: string
): Promise<SearchResponse> => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      apikey: API_KEY,
      s: query,
      page: page.toString(),
    });

    // Add type filter if specified
    if (type && type !== 'all') {
      params.append('type', type);
    }

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle API-level errors
    if (data.Response === 'False') {
      return {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: data.Error || 'No results found'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies. Please check your connection and try again.');
  }
};

// Get detailed movie information
export const getMovieDetails = async (imdbID: string): Promise<MovieDetailsResponse> => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      i: imdbID,
      plot: 'full', // Get full plot
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to load movie details. Please try again.');
  }
};

// Helper function to check if poster URL is valid
export const isValidPosterUrl = (url: string): boolean => {
  return url && url !== 'N/A' && url.startsWith('http');
};

// Get fallback poster for movies without images
export const getFallbackPoster = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
};