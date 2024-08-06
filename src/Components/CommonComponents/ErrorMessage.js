import React from 'react'
import { MdErrorOutline } from "react-icons/md";


const style={
    fontSize: "12px"
}

const ErrorMessage = ({text}) => {
  return (
    <span style={style} className='text-danger d-flex align-items-center'><MdErrorOutline />{" "}{text}</span>    
  )
}

export default ErrorMessage