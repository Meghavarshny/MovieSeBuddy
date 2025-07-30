import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Star, 
  Globe, 
  Award,
  Users,
  Film,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getMovieDetails, MovieDetailsResponse, isValidPosterUrl, getFallbackPoster } from '@/services/omdbApi';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        setError('Movie ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

 
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={handleBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            </div>
            
            {}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={handleBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col items-center justify-center py-12">
            <Alert className="max-w-md border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                {error || 'Movie not found'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const posterSrc = !imageError && isValidPosterUrl(movie.Poster) 
    ? movie.Poster 
    : getFallbackPoster();

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return 'text-green-500';
    if (numRating >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <img
                  src={posterSrc}
                  alt={`${movie.Title} poster`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                {movie.Type && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    <Film className="w-3 h-3 mr-1" />
                    {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {movie.Title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.Year}</span>
                </div>
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.Runtime}</span>
                  </div>
                )}
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <Badge variant="outline">{movie.Rated}</Badge>
                )}
              </div>

              {/* Genres */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.Genre.split(', ').map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Plot */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <Card>
                <CardHeader>
                  <CardTitle>Plot</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{movie.Plot}</p>
                </CardContent>
              </Card>
            )}

            {/* Ratings */}
            {movie.Ratings && movie.Ratings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>IMDb</span>
                        </div>
                        <span className={`font-semibold ${getRatingColor(movie.imdbRating)}`}>
                          {movie.imdbRating}/10
                        </span>
                      </div>
                    )}
                    
                    {movie.Ratings.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span>{rating.Source}</span>
                        <span className="font-semibold">{rating.Value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cast and Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.Director && movie.Director !== 'N/A' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Director
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{movie.Director}</p>
                  </CardContent>
                </Card>
              )}

              {movie.Actors && movie.Actors !== 'N/A' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Cast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{movie.Actors}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {movie.Released && movie.Released !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Date:</span>
                    <span className="text-foreground">{movie.Released}</span>
                  </div>
                )}
                
                {movie.Language && movie.Language !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="text-foreground">{movie.Language}</span>
                  </div>
                )}
                
                {movie.Country && movie.Country !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="text-foreground">{movie.Country}</span>
                  </div>
                )}
                
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Box Office:</span>
                    <span className="text-foreground">{movie.BoxOffice}</span>
                  </div>
                )}
                
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">Awards</span>
                      </div>
                      <p className="text-foreground">{movie.Awards}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;