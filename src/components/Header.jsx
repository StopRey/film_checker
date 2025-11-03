import PropTypes from 'prop-types'

function Header({ searchQuery, onSearchChange }) {
  return (
    <header 
      className="sticky top-0 z-50 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ backgroundColor: '#0f1014' }}
    >
      <h1 className="text-xl md:text-2xl font-bold text-white">
        Film Checker
      </h1>
      <div className="w-full md:flex-1 md:max-w-md md:ml-8">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
          style={{ backgroundColor: '#1d242a' }}
        />
      </div>
    </header>
  )
}

Header.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
}

export default Header

