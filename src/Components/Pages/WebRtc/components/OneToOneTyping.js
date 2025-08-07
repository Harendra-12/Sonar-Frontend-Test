import TypingLoader from "./TypingLoader"

const OneToOneTyping = ({ shouldProfileShow }) => {
  return (
    <div className="d-flex group_typing align-items-center px-3">
      {
        shouldProfileShow ? (
          <div className="d-flex">
            <div className="profileHolder">
              <i className="fas fa-user"></i>
            </div>
          </div>
        ) : null
      }

      <TypingLoader />
    </div>
  )
}

export default OneToOneTyping
