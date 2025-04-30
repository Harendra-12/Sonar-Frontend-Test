import React, { useCallback } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialEdges, initialNodes } from "./workflow.constants";
import PressDigits from "./customNodes/PressDigits";
import CustomEdge from "./CustomEdge";
import ConversationOptions from "./ConversationOptions";
import CallBegin from "./customNodes/CallBegin";

// Custom node types
const nodeTypes = {
  callBegin: CallBegin,
  pressDigits: PressDigits,
};

// Custom edgge types
const edgeTypes = {
  customedge: CustomEdge,
};

const Reactflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `${connection.source}-${connection.target}`,
        type: "customEdge",
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // Function to handle updates from child nodes (e.g., PressDigit)
  const handleNodeUpdate = (nodeId, updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
  };

  // Map all nodes to include the onUpdate handler
  const nodesWithHandlers = nodes.map((node) => {
    // Add the onUpdate handler to pressDigit nodes
    if (node.type === "pressDigit") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    return node;
  });

  return (
    <main className="mainContent">
      <div className="flowMain">
        <ReactFlow
          className="reactFlowCanvas"
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          style={{ height: "100vh" }}
        >
          <Panel position="top-right" className="conversation-panel">
            <ConversationOptions />
          </Panel>
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
        </ReactFlow>
      </div>
    </main>
  );
};

export default Reactflow;
