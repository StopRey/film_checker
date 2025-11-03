import PropTypes from 'prop-types'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg text-white border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        style={{ 
          backgroundColor: '#1d242a',
          borderColor: '#374151'
        }}
      >
        Previous
      </button>
      
      {currentPage > 3 && totalPages > 5 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg text-white border transition-colors hover:bg-gray-700"
            style={{ 
              backgroundColor: '#1d242a',
              borderColor: '#374151'
            }}
          >
            1
          </button>
          {currentPage > 4 && (
            <span className="text-gray-400 px-2">...</span>
          )}
        </>
      )}
      
      <div className="flex gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg text-white border transition-colors ${
                currentPage === pageNum 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-gray-700'
              }`}
              style={{ 
                backgroundColor: currentPage === pageNum ? '#3b82f6' : '#1d242a',
                borderColor: currentPage === pageNum ? '#3b82f6' : '#374151'
              }}
            >
              {pageNum}
            </button>
          )
        })}
      </div>
      
      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="text-gray-400 px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg text-white border transition-colors hover:bg-gray-700"
            style={{ 
              backgroundColor: '#1d242a',
              borderColor: '#374151'
            }}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg text-white border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        style={{ 
          backgroundColor: '#1d242a',
          borderColor: '#374151'
        }}
      >
        Next
      </button>
      
      <span className="text-gray-400 text-sm px-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default Pagination

