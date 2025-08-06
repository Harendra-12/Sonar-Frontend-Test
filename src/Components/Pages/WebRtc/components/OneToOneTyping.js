const OneToOneTyping = ({ shouldProfileShow }) => {
  return (
    <div className="d-flex typingLoader_wrap align-items-center px-3">
      {
        shouldProfileShow ? (
          <div className="d-flex">
            <div className="profileHolder">
              <i className="fas fa-user"></i>
            </div>
          </div>
        ) : null
      }

      <div className="d-flex gap-1 ms-2">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
    </div>
  )
}

export default OneToOneTyping
