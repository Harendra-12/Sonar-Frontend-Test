import { Button } from "./ui/button";
import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import React from "react";

const CustomEdge = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props;

  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      {/* <BezierEdge {...props} /> */}
      <path
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={2}
      />
      <EdgeLabelRenderer>
        <Button
          className="text-red-600 hover:bg-none hover:text-red-600 nodrag absolute text-5xl"
          size="icon"
          variant="ghost"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          onClick={() =>
            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id))
          }
        >
         X
        </Button>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
