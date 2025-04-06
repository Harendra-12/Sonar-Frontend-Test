import { Handle } from "@xyflow/react";
import React from "react";

const CustomHandle = (props) => {
  return (
    <Handle
      className="bg-white border-2 border-black rounded-full"
      style={{ height: "10px", width: "10px" }}
      //   style={{
      //       //     width: 20,
      //     height: 20,
      //     background: "white",
      //     border: "2px solid black",
      //   }}
      {...props}
    />
  );
};

export default CustomHandle;
