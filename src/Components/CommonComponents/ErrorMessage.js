import React from "react";
import { MdErrorOutline } from "react-icons/md";

const style = {
  fontSize: "12px",
};

const ErrorMessage = ({ text }) => {
  return (
    <div className="d-flex align-items-center">
      <MdErrorOutline className="text-danger" style={{ flexShrink: 0 }} />
      <span style={style} className="text-danger ms-1">
        {text}
      </span>
    </div>
  );
};

export default ErrorMessage;
