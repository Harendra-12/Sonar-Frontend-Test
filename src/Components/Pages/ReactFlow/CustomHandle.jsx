import { Handle } from "@xyflow/react";
import React from "react";

const CustomHandle = ({ style = {}, ...props }) => {
  return (
    <Handle
      style={{
        width: "12px",
        height: "12px",
        background: "#4dabf7",
        border: "2px solid white",
        borderRadius: "50%",
        ...style,
      }}
      {...props}
    />
  );
};

export default CustomHandle;
