import { useState, useEffect, useCallback } from 'react'
import { searchMovies, discoverMovies } from './api/movieDB'
import './App.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

/* eslint-disable react/prop-types */
function MovieCard({ movie }) {
  const posterUrl = movie.poster_path 
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'
  
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = movie.vote_average || 0
  const genre = movie.genre_names?.[0] || 'Unknown'

  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 hover:border-2 hover:border-blue-500 cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          {rating.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>{releaseYear}</span>
          <span className="px-2 py-1 bg-gray-700 rounded text-xs">{genre}</span>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
          {movie.overview || 'No overview available'}
        </p>
      </div>
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
/* eslint-enable react/prop-types */

const genreMap = {
  'action': 28,
  'comedy': 35,
  'drama': 18,
  'horror': 27,
  'sci-fi': 878
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
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

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'watched', label: 'Watched' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'toWatch', label: 'Want to Watch' }
  ]

  const getSortByString = useCallback(() => {
    if (sortBy.popularity === 'desc') return 'popularity.desc'
    if (sortBy.popularity === 'asc') return 'popularity.asc'
    if (sortBy.rating === 'desc') return 'vote_average.desc'
    if (sortBy.rating === 'asc') return 'vote_average.asc'
    if (sortBy.releaseDate === 'desc') return 'release_date.desc'
    if (sortBy.releaseDate === 'asc') return 'release_date.asc'
    return 'popularity.desc'
  }, [sortBy])

  const fetchMovies = useCallback(async () => {
    if (activeTab !== 'home') return
    
    setLoading(true)
    try {
      let response
      
      if (searchQuery.trim()) {
        response = await searchMovies(searchQuery)
      } else {
        const sortByString = getSortByString()
        const genreIds = filters.genre ? [genreMap[filters.genre]] : undefined
        const year = filters.year ? parseInt(filters.year) : undefined
        const minRating = filters.minRating ? parseFloat(filters.minRating) : undefined
        
        response = await discoverMovies({
          genres: genreIds,
          year: year,
          minRating: minRating,
          sortBy: sortByString,
          page: 1
        })
      }
      
      if (response.results) {
        setMovies(response.results)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, activeTab, getSortByString])

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#15181f' }}>
      <header 
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: '#0f1014' }}
      >
        <h1 className="text-2xl font-bold text-white">
          Film Checker
        </h1>
        <div className="flex-1 max-w-md ml-8">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
      </header>

      <div className="flex">
        <aside className="w-[30%] p-6">
          <div className="bg-gray-800 rounded-lg p-4 space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sorting</h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleSort('popularity')}
                  className={`w-full px-3 py-2 rounded text-white border hover:bg-gray-600 focus:outline-none focus:border-blue-500 text-left flex items-center justify-between ${
                    sortBy.popularity ? 'bg-blue-600 border-blue-500' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <span>Popularity</span>
                  {getSortIcon('popularity') && (
                    <span className="text-gray-400">{getSortIcon('popularity')}</span>
                  )}
                </button>
                <button 
                  onClick={() => handleSort('rating')}
                  className={`w-full px-3 py-2 rounded text-white border hover:bg-gray-600 focus:outline-none focus:border-blue-500 text-left flex items-center justify-between ${
                    sortBy.rating ? 'bg-blue-600 border-blue-500' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <span>Rating</span>
                  {getSortIcon('rating') && (
                    <span className="text-gray-400">{getSortIcon('rating')}</span>
                  )}
                </button>
                <button 
                  onClick={() => handleSort('releaseDate')}
                  className={`w-full px-3 py-2 rounded text-white border hover:bg-gray-600 focus:outline-none focus:border-blue-500 text-left flex items-center justify-between ${
                    sortBy.releaseDate ? 'bg-blue-600 border-blue-500' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <span>Release Date</span>
                  {getSortIcon('releaseDate') && (
                    <span className="text-gray-400">{getSortIcon('releaseDate')}</span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select 
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All genres</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="sci-fi">Science Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Year
                  </label>
                  <select 
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select 
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All ratings</option>
                    <option value="9">9+</option>
                    <option value="8">8+</option>
                    <option value="7">7+</option>
                    <option value="6">6+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="w-[70%] p-6">
          <div className="mb-6 border-b border-gray-700">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'home' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                ) : movies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">No movies found</div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'watched' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Watched Movies</h2>
                <p className="text-gray-400">List of movies you&apos;ve already watched</p>
              </div>
            )}
            
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Favorite Movies</h2>
                <p className="text-gray-400">Your favorite movies</p>
              </div>
            )}
            
            {activeTab === 'toWatch' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Want to Watch</h2>
                <p className="text-gray-400">Movies you plan to watch</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

