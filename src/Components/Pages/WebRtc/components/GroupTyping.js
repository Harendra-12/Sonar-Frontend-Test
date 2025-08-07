import TypingLoader from "./TypingLoader"


const GroupTyping = ({ shouldProfileShow, typingUserList }) => {
  return (
    <>
      <div className="d-flex group_typing align-items-center px-3 py-1">
        {shouldProfileShow && (
          <div className="d-flex align-items-center">
            {/* Profile icons */}
            {typingUserList?.slice(0, 4).map((item, index) => (
              <div className="profileHolder" key={index}>
                {item?.profile_picture ? (
                  <img
                    src={item.profile_picture}
                    alt="profile"
                  />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
            ))}

            {typingUserList?.length > 4 && (
              <div className="profileHolder moreUser">
                <span className="fs-12">
                  <i className="far fa-plus"></i> {typingUserList.length - 4}
                </span>
              </div>
            )}

            {/* Typing usernames */}
            <div className="ms-2">
              <p className="mb-0 f-s-14 ellipsisText300">
                {typingUserList?.slice(0, 4).map((item, index) => (
                  <span key={index}>
                    {item.username}
                    {index < Math.min(typingUserList.length, 4) - 1 && ', '}
                  </span>
                ))}
                {typingUserList?.length > 4 && (
                  <span>{` +${typingUserList.length - 4}`}</span>
                )}
              </p>
            </div>
          </div>
        )}


        {/* <div class="d-flex gap-1 align-items-center ms-2">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div> */}
        <TypingLoader />

      </div >
    </>
  )
}

export default GroupTyping