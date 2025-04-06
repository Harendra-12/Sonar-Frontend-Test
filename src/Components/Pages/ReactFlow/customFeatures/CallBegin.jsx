import { Badge } from "../ui/badge";
import React from "react";
import { Position } from "@xyflow/react";
import CustomHandle from "../CustomHandle";

const CallBegin = () => {
  return (
    <>
      <Badge className="bg-green-500 p-2 font-bold">
      <i class="fa-solid fa-phone-arrow-up-right"></i>
        Call Begin
      </Badge>
      <CustomHandle type="source" position={Position.Bottom} />
    </>
  );
};

export default CallBegin;
