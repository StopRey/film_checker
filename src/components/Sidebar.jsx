import PropTypes from 'prop-types'
import { sortByShape, filtersShape } from '../types/propTypes'
import { genreIdToName } from '../constants'

function Sidebar({ sortBy, filters, searchQuery, onSort, onFilterChange, onClearAll, getSortIcon }) {
  const hasActiveFilters = sortBy.popularity || sortBy.rating || sortBy.releaseDate || filters.genre || filters.year || filters.minRating || (searchQuery && searchQuery.trim())

  return (
    <aside className="w-full lg:w-[350px] lg:flex-shrink-0 lg:flex-grow-0 p-4 md:p-6">
      <div className="rounded-lg p-4 md:p-6 space-y-6" style={{ backgroundColor: '#1d242a' }}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 min-h-[30px]">
            <h2 className="text-lg md:text-xl font-semibold text-white">Sorting</h2>
            <button
              onClick={onClearAll}
              className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                hasActiveFilters
                  ? 'text-red-400 hover:text-red-300 border-red-500/50 hover:bg-red-500/10 opacity-100 visible'
                  : 'opacity-0 invisible pointer-events-none'
              }`}
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={() => onSort('popularity')}
              className={`w-full px-4 py-3 rounded-lg text-white border transition-all duration-200 focus:outline-none text-left flex items-center justify-between ${
                sortBy.popularity 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              style={{ 
                backgroundColor: '#1d242a',
                borderColor: sortBy.popularity ? '#3b82f6' : '#374151'
              }}
            >
              <span className="font-medium">Popularity</span>
              <span className="text-blue-400 text-lg font-bold min-w-[20px] text-center">
                {getSortIcon('popularity') || ''}
              </span>
            </button>
            <button 
              onClick={() => onSort('rating')}
              className={`w-full px-4 py-3 rounded-lg text-white border transition-all duration-200 focus:outline-none text-left flex items-center justify-between ${
                sortBy.rating 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              style={{ 
                backgroundColor: '#1d242a',
                borderColor: sortBy.rating ? '#3b82f6' : '#374151'
              }}
            >
              <span className="font-medium">Rating</span>
              <span className="text-blue-400 text-lg font-bold min-w-[20px] text-center">
                {getSortIcon('rating') || ''}
              </span>
            </button>
            <button 
              onClick={() => onSort('releaseDate')}
              className={`w-full px-4 py-3 rounded-lg text-white border transition-all duration-200 focus:outline-none text-left flex items-center justify-between ${
                sortBy.releaseDate 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              style={{ 
                backgroundColor: '#1d242a',
                borderColor: sortBy.releaseDate ? '#3b82f6' : '#374151'
              }}
            >
              <span className="font-medium">Release Date</span>
              <span className="text-blue-400 text-lg font-bold min-w-[20px] text-center">
                {getSortIcon('releaseDate') || ''}
              </span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Filters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onFilterChange('genre', '')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !filters.genre
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All genres
                </button>
                {Object.entries(genreIdToName).map(([id, name]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onFilterChange('genre', id.toString())}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.genre === id.toString()
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Year
              </label>
              <input
                type="text"
                value={filters.year}
                onChange={(e) => onFilterChange('year', e.target.value)}
                placeholder="YYYY (e.g., 2024)"
                className="w-full px-4 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                style={{ backgroundColor: '#15181f' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Rating (0-10)
              </label>
              <input
                type="number"
                value={filters.minRating}
                onChange={(e) => onFilterChange('minRating', e.target.value)}
                placeholder="0-10"
                min="0"
                max="10"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                style={{ backgroundColor: '#15181f' }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  sortBy: sortByShape.isRequired,
  filters: filtersShape.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  getSortIcon: PropTypes.func.isRequired
}

export default Sidebar

