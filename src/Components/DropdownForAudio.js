import React from 'react'

export default function DropdownForAudio({item,index,currentPlaying,setShowDropdown, setShowAudio,handlePlaying}) {
  return (
    <div>   <ul className="" key={index}>
    <>
      <li className="dropdown-item">
        <div
          className="clearButton text-align-start"
          onClick={(e) => {
            e.stopPropagation();
            if (item.recording_path === currentPlaying) {
              setShowDropdown(false);
              setShowAudio(true);
              handlePlaying(item.recording_path);
            }
          }}
        >
          <i
            className={`fa-solid fa-${
              item?.recording_path !== null ? "play" : "triangle-exclamation"
            } me-2`}
          ></i>
          Play
        </div>
      </li>
      <li className="dropdown-item">
        <div className="clearButton text-align-start">
          <i className="fa-solid fa-bolt me-2"></i>
          Transcript
        </div>
      </li>
    </>
    <>
      <li className="dropdown-item">
        <div className="clearButton text-align-start">
          <i className="fa-regular fa-download"></i> Download
        </div>
      </li>
    </>
    <li className="dropdown-item"></li>
  </ul></div>
  )
}
