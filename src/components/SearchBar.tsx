import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
  loading?: boolean;
  initialQuery?: string;
  initialType?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  loading = false, 
  initialQuery = '', 
  initialType = 'all' 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);

  
  useEffect(() => {
    setSearchQuery(initialQuery);
    setSelectedType(initialType);
  }, [initialQuery, initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), selectedType);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery.trim(), selectedType);
    }
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), newType);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies, TV shows, episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
            disabled={loading}
          />
        </div>

        {}
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full sm:w-[140px] bg-card border-border">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="series">TV Series</SelectItem>
            <SelectItem value="episode">Episodes</SelectItem>
          </SelectContent>
        </Select>

        {}
        <Button 
          type="submit" 
          disabled={loading || !searchQuery.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Searching...
            </div>
          ) : (
            'Search'
          )}
        </Button>
      </form>

      {}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['avengers', 'inception', 'breaking bad', 'friends', 'batman'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSearch(suggestion, selectedType)}
              className="text-xs border-border hover:bg-secondary"
              disabled={loading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;