import React from 'react'

export default function DropdownForAudio({ item, index, currentPlaying, setShowDropdown, setShowAudio, handlePlaying, setTranscribeLink }) {
  return (
    <div>
      <ul className="actionBtnDropdowns" key={index} style={{ position: "absolute", zIndex: 1 }}>
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
                className={`fa-solid fa-${item?.recording_path !== null ? "play" : "triangle-exclamation"
                  } me-2`}
              ></i>
              Play
            </div>
          </li>
          <li className="dropdown-item" onClick={() => {setTranscribeLink(item?.recording_path); setShowDropdown(false);}}>
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
      </ul>
    </div>
  )
}
