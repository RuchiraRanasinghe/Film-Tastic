
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import { Moon, Sun, Search } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { searchMovies, searchQuery } = useMovies();
  const [query, setQuery] = useState(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMovies(query);
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Film</span>
            <span className="text-2xl font-bold">Tastic</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 px-4 max-w-xl mx-4">
          <div className="relative flex w-full">
            <Input
              type="text"
              placeholder="Search movies..."
              className="w-full pr-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <span className="text-sm font-medium">Hi, {user.username}</span>
              </div>
              <Link to="/favorites">
                <Button variant="ghost" size="sm">
                  Favorites
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile search */}
      <form onSubmit={handleSearch} className="sm:hidden mt-3 px-4">
        <div className="relative flex w-full">
          <Input
            type="text"
            placeholder="Search movies..."
            className="w-full pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </header>
  );
};

export default Header;
