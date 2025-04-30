import React from "react";
import CustomHandle from "../CustomHandle";
import { Position } from "@xyflow/react";

const PressDigits = ({ id, data }) => {
  console.log("PressDigits node data:", data);
  return (
    <>
      <div>
        <h1>{data.label}</h1>
        <p>{data.description}</p>
      </div>
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default PressDigits;
