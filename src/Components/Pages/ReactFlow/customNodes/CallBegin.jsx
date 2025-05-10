import React from "react";
import CustomHandle from "../CustomHandle";
import { Position } from "@xyflow/react";

const CallBegin = () => {
  return (
    <>
      <div className="call-begin-node">
        <span>Call Begin</span>
      </div>
      <CustomHandle type="source" position={Position.Right} />
    </>
  );
};

export default CallBegin;
