import PropTypes from 'prop-types'

function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 pb-1 right-6 z-40 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl font-bold"
      title="Add custom movie"
    >
      +
    </button>
  )
}

FloatingAddButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default FloatingAddButton

