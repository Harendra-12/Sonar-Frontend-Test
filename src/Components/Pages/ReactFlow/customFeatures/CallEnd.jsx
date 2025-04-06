import { Badge } from "../ui/badge";
import React from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { Button } from "../ui/button";

const CallEnd = ({ id }) => {
  const { setNodes } = useReactFlow();
  return (
    <>
      <Badge className="bg-red-400 p-2 font-bold">
      <i class="fa-solid fa-phone-slash"></i>
        Call End
        <Button
          className="text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() =>
            setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))
          }
        >
          <i class="fa-solid fa-circle-xmark"></i>
        </Button>
      </Badge>
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default CallEnd;
