import React from 'react'

function CircularLoader({widthAdjust}) {
  return (
    <div className={`circularLoader ${widthAdjust}`}>
      <img  src={require("../../assets/images/loader-gif.webp")} />
    </div>
  )
}

export default CircularLoader
