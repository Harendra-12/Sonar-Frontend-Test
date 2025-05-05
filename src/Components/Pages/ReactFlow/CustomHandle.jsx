import { Handle } from "@xyflow/react";
import React from "react";

const CustomHandle = (props) => {
  return (
    <Handle
      className="bg-white border-2 border-black rounded-full hover:bg-gray-200 transition-colors"
      style={{
        width: "12px",
        height: "12px",
        position: "absolute",
        zIndex: 10,
      }}
      {...props}
    />
  );
};

export default CustomHandle;
