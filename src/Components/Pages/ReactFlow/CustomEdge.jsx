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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const { setEdges } = useReactFlow();

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={2}
      />
      <EdgeLabelRenderer>
        <button
          className="xIconBtn"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          onClick={() => {
            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
            console.log("Edge deleted");
          }}
        >
          X
          {/* <i
            className="fa-solid fa-x"
            style={{ height: "40px", width: "40px", fontSize: "20px" }}
          ></i> */}
        </button>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
