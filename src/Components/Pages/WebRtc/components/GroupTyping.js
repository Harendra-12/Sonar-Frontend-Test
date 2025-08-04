import React from 'react'

const GroupTyping = () => {
  return (
    <>
      <div className="d-flex group_typing align-items-center px-3">
        <div class=" d-flex">
          <div className="profileHolder">
            {/* <img
              src={`require("../../../assets/images/placeholder-image.webp"))`}
              alt="profile"
             
            /> */}
            <i className="fas fa-user"></i>
          </div>
          <div className="profileHolder">
            {/* <img
              src={`require("../../../assets/images/placeholder-image.webp"))`}
              alt="profile"
             
            /> */}
            <i className="fas fa-user"></i>
          </div>
          <div className="profileHolder">
            {/* <img
              src={`require("../../../assets/images/placeholder-image.webp"))`}
              alt="profile"
             
            /> */}
            <i className="fas fa-user"></i>
          </div>
          <div className="profileHolder moreUser">
            {/* <img
              src={`require("../../../assets/images/placeholder-image.webp"))`}
              alt="profile"
             
            /> */}
            <span className='fs-12'><i class="far fa-plus " ></i> 6</span>
          </div>

        </div>
        <div className="ms-2 ">
          <p className='mb-0 f-s-14 ellipsisText300'>
            <span>Webvio Technologies,</span>
            <span> koushal3 barick,</span>
            <span> Rajendro Sauk</span>
          </p>
        </div>
        <div class="d-flex gap-1 align-items-center ms-2">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div>

      </div >
    </>
  )
}

export default GroupTyping