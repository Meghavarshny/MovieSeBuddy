import React, { useState } from 'react';
import { Calendar, Film, Tv, PlayCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Movie, isValidPosterUrl, getFallbackPoster } from '@/services/omdbApi';

interface MovieCardProps {
  movie: Movie;
  onClick: (imdbID: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'series':
        return <Tv className="w-4 h-4" />;
      case 'episode':
        return <PlayCircle className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie':
        return 'bg-accent text-accent-foreground';
      case 'series':
        return 'bg-primary text-primary-foreground';
      case 'episode':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const posterSrc = !imageError && isValidPosterUrl(movie.Poster) 
    ? movie.Poster 
    : getFallbackPoster();

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card border-border overflow-hidden"
      onClick={() => onClick(movie.imdbID)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Film className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Movie poster */}
        <img
          src={posterSrc}
          alt={`${movie.Title} poster`}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        
        {/* Overlay with gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`${getTypeColor(movie.Type)} flex items-center gap-1`}>
            {getTypeIcon(movie.Type)}
            <span className="capitalize">{movie.Type}</span>
          </Badge>
        </div>

        {/* Hover overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm opacity-90">
            Click to view details
          </p>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Movie title */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {movie.Title}
          </h3>
          
          {/* Release year */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{movie.Year}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;