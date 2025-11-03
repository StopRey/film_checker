import { useState, useEffect, useCallback } from 'react'
import { searchMovies, discoverMovies, getMovieDetails, getMovieCredits } from './api/movieDB'
import './App.css'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Tabs from './components/Tabs'
import MovieGrid from './components/MovieGrid'
import MovieList from './components/MovieList'
import CustomMovieGrid from './components/CustomMovieGrid'
import MovieModal from './components/MovieModal'
import MovieForm from './components/MovieForm'
import FloatingAddButton from './components/FloatingAddButton'
import Pagination from './components/Pagination'
import { getSortByString, filterAndSortMovies } from './utils/movieUtils'
import { genreMap, genreIdToName } from './constants'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [watchedMovies, setWatchedMovies] = useState([])
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [wantToWatchMovies, setWantToWatchMovies] = useState([])
  const [customMovies, setCustomMovies] = useState([])
  const [showMovieForm, setShowMovieForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [sortBy, setSortBy] = useState({
    popularity: null,
    rating: null,
    releaseDate: null
  })
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: ''
  })
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [movieCredits, setMovieCredits] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchMovies = useCallback(async () => {
    if (activeTab !== 'home') return
    
    setLoading(true)
    try {
      let response
      
      if (searchQuery.trim()) {
        response = await searchMovies(searchQuery, currentPage)
      } else {
        const sortByString = getSortByString(sortBy)
        const genreId = filters.genre ? (genreMap[filters.genre] || parseInt(filters.genre)) : undefined
        const genreIds = genreId ? [genreId] : undefined
        const year = filters.year ? parseInt(filters.year) : undefined
        const minRating = filters.minRating ? parseFloat(filters.minRating) : undefined
        
        response = await discoverMovies({
          genres: genreIds,
          year: year,
          minRating: minRating,
          sortBy: sortByString,
          page: currentPage
        })
      }
      
      if (response.results) {
        const normalizedMovies = response.results.map(movie => {
          const normalized = { ...movie }
          if (normalized.genre_ids && !normalized.genre_names) {
            normalized.genre_names = normalized.genre_ids
              .map(id => genreIdToName[id])
              .filter(Boolean)
          }
          return normalized
        })
        setMovies(normalizedMovies)
        setTotalPages(response.total_pages || 1)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      setMovies([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, activeTab, sortBy, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, filters])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleSort = (sortType) => {
    setSortBy(prev => {
      const current = prev[sortType]
      const newState = {
        popularity: null,
        rating: null,
        releaseDate: null
      }
      
      if (current === null) {
        newState[sortType] = 'desc'
      } else if (current === 'desc') {
        newState[sortType] = 'asc'
      } else {
        newState[sortType] = null
      }
      
      return newState
    })
  }

  const getSortIcon = (sortType) => {
    const current = sortBy[sortType]
    if (current === 'desc') return '↓'
    if (current === 'asc') return '↑'
    return null
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const normalizeMovie = (movie) => {
    const normalized = { ...movie }
    
    if (normalized.genres && Array.isArray(normalized.genres)) {
      if (!normalized.genre_ids) {
        normalized.genre_ids = normalized.genres.map(g => g.id)
      }
      if (!normalized.genre_names) {
        normalized.genre_names = normalized.genres.map(g => g.name)
      }
    }
    
    if (normalized.genre_ids && !normalized.genre_names) {
      normalized.genre_names = normalized.genre_ids
        .map(id => genreIdToName[id])
        .filter(Boolean)
    }
    
    return normalized
  }

  const toggleWatched = (movie) => {
    setWatchedMovies(prev => {
      const exists = prev.find(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, normalizeMovie(movie)]
      }
    })
  }

  const toggleFavorite = (movie) => {
    setFavoriteMovies(prev => {
      const exists = prev.find(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, normalizeMovie(movie)]
      }
    })
  }

  const toggleWantToWatch = (movie) => {
    setWantToWatchMovies(prev => {
      const exists = prev.find(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, normalizeMovie(movie)]
      }
    })
  }

  const isMovieWatched = (movieId) => watchedMovies.some(m => m.id === movieId)
  const isMovieFavorite = (movieId) => favoriteMovies.some(m => m.id === movieId)
  const isMovieWantToWatch = (movieId) => wantToWatchMovies.some(m => m.id === movieId)

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie)
    
    if (movie.isCustom) {
      setMovieDetails(movie)
      setMovieCredits(null)
      setLoadingDetails(false)
      return
    }
    
    setLoadingDetails(true)
    setMovieDetails(null)
    setMovieCredits(null)
    
    try {
      const [details, credits] = await Promise.all([
        getMovieDetails(movie.id),
        getMovieCredits(movie.id)
      ])
      setMovieDetails(details)
      setMovieCredits(credits)
    } catch (error) {
      console.error('Error fetching movie details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeMovieModal = () => {
    setSelectedMovie(null)
    setMovieDetails(null)
    setMovieCredits(null)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSortBy({
      popularity: null,
      rating: null,
      releaseDate: null
    })
    setFilters({
      genre: '',
      year: '',
      minRating: ''
    })
  }

  const handleSaveMovie = (movieData) => {
    if (editingMovie) {
      setCustomMovies(prev => 
        prev.map(m => m.id === editingMovie.id ? normalizeMovie(movieData) : m)
      )
    } else {
      setCustomMovies(prev => [...prev, normalizeMovie(movieData)])
    }
    setShowMovieForm(false)
    setEditingMovie(null)
  }

  const handleEditMovie = (movie) => {
    setEditingMovie(movie)
    setShowMovieForm(true)
  }

  const handleDeleteMovie = (movieId) => {
    setCustomMovies(prev => prev.filter(m => m.id !== movieId))
    setWatchedMovies(prev => prev.filter(m => m.id !== movieId))
    setFavoriteMovies(prev => prev.filter(m => m.id !== movieId))
    setWantToWatchMovies(prev => prev.filter(m => m.id !== movieId))
  }

  const handleOpenForm = () => {
    setEditingMovie(null)
    setShowMovieForm(true)
  }

  const handleCloseForm = () => {
    setShowMovieForm(false)
    setEditingMovie(null)
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return searchQuery ? `Search Results for "${searchQuery}"` : 'Movies Browser'
      case 'watched':
        return 'Watched Movies'
      case 'favorites':
        return 'Favorite Movies'
      case 'toWatch':
        return 'Want to Watch'
      case 'custom':
        return 'My Movies'
      default:
        return 'Movies'
    }
  }

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'watched':
        return 'No watched movies yet'
      case 'favorites':
        return 'No favorite movies yet'
      case 'toWatch':
        return 'No movies in your watchlist yet'
      case 'custom':
        return 'No custom movies yet. Click the + button to add one!'
      default:
        return 'No movies found'
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#15181f' }}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-col lg:flex-row">
        <Sidebar
          sortBy={sortBy}
          filters={filters}
          searchQuery={searchQuery}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          getSortIcon={getSortIcon}
        />

        <main className="w-full lg:flex-1 lg:min-w-0 p-4 md:p-6">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === 'home' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  {getTabTitle()}
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                ) : movies.length > 0 ? (
                  <>
                    <MovieGrid
                      movies={movies}
                      isMovieWatched={isMovieWatched}
                      isMovieFavorite={isMovieFavorite}
                      isMovieWantToWatch={isMovieWantToWatch}
                      onToggleWatched={toggleWatched}
                      onToggleFavorite={toggleFavorite}
                      onToggleWantToWatch={toggleWantToWatch}
                      onMovieClick={handleMovieClick}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">{getEmptyMessage()}</div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'watched' && (
              <MovieList
                movies={watchedMovies}
                searchQuery={searchQuery}
                filters={filters}
                sortBy={sortBy}
                isMovieWatched={isMovieWatched}
                isMovieFavorite={isMovieFavorite}
                isMovieWantToWatch={isMovieWantToWatch}
                onToggleWatched={toggleWatched}
                onToggleFavorite={toggleFavorite}
                onToggleWantToWatch={toggleWantToWatch}
                onMovieClick={handleMovieClick}
                title={getTabTitle()}
                emptyMessage={getEmptyMessage()}
              />
            )}
            
            {activeTab === 'favorites' && (
              <MovieList
                movies={favoriteMovies}
                searchQuery={searchQuery}
                filters={filters}
                sortBy={sortBy}
                isMovieWatched={isMovieWatched}
                isMovieFavorite={isMovieFavorite}
                isMovieWantToWatch={isMovieWantToWatch}
                onToggleWatched={toggleWatched}
                onToggleFavorite={toggleFavorite}
                onToggleWantToWatch={toggleWantToWatch}
                onMovieClick={handleMovieClick}
                title={getTabTitle()}
                emptyMessage={getEmptyMessage()}
              />
            )}
            
            {activeTab === 'toWatch' && (
              <MovieList
                movies={wantToWatchMovies}
                searchQuery={searchQuery}
                filters={filters}
                sortBy={sortBy}
                isMovieWatched={isMovieWatched}
                isMovieFavorite={isMovieFavorite}
                isMovieWantToWatch={isMovieWantToWatch}
                onToggleWatched={toggleWatched}
                onToggleFavorite={toggleFavorite}
                onToggleWantToWatch={toggleWantToWatch}
                onMovieClick={handleMovieClick}
                title={getTabTitle()}
                emptyMessage={getEmptyMessage()}
              />
            )}

            {activeTab === 'custom' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  {getTabTitle()}
                  {filterAndSortMovies(customMovies, searchQuery, filters, sortBy).length !== customMovies.length && (
                    <span className="text-sm text-gray-400 font-normal ml-2">
                      ({filterAndSortMovies(customMovies, searchQuery, filters, sortBy).length} of {customMovies.length})
                    </span>
                  )}
                </h2>
                {customMovies.length > 0 ? (
                  filterAndSortMovies(customMovies, searchQuery, filters, sortBy).length > 0 ? (
                    <CustomMovieGrid
                      movies={filterAndSortMovies(customMovies, searchQuery, filters, sortBy)}
                      isMovieWatched={isMovieWatched}
                      isMovieFavorite={isMovieFavorite}
                      isMovieWantToWatch={isMovieWantToWatch}
                      onToggleWatched={toggleWatched}
                      onToggleFavorite={toggleFavorite}
                      onToggleWantToWatch={toggleWantToWatch}
                      onMovieClick={handleMovieClick}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-gray-400 text-xl">No movies match your filters</div>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">{getEmptyMessage()}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {activeTab === 'custom' && <FloatingAddButton onClick={handleOpenForm} />}

      {showMovieForm && (
        <MovieForm
          movie={editingMovie}
          onSave={handleSaveMovie}
          onCancel={handleCloseForm}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          details={movieDetails}
          credits={movieCredits}
          loading={loadingDetails}
          isWatched={isMovieWatched(selectedMovie.id)}
          isFavorite={isMovieFavorite(selectedMovie.id)}
          isWantToWatch={isMovieWantToWatch(selectedMovie.id)}
          onClose={closeMovieModal}
          onToggleWatched={toggleWatched}
          onToggleFavorite={toggleFavorite}
          onToggleWantToWatch={toggleWantToWatch}
          onEdit={selectedMovie?.isCustom || movieDetails?.isCustom ? handleEditMovie : undefined}
          onDelete={selectedMovie?.isCustom || movieDetails?.isCustom ? handleDeleteMovie : undefined}
        />
      )}
    </div>
  )
}

export default App
