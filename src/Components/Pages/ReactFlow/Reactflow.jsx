import React, { useCallback } from "react";
import dagre from "dagre";
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
import Extension from "./customNodes/Extension";
import RingGroup from "./customNodes/RingGroup";
import CallCenter from "./customNodes/CallCenter";
import Ivr from "./customNodes/Ivr";
import Hangup from "./customNodes/Hangup";
import BackToIvr from "./customNodes/BackToIvr";
import Pstn from "./customNodes/Pstn";

// Utility function for auto layout
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300;
  const nodeHeight = 150;

  // Set graph direction and other settings
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "network-simplex",
    align: "UL",
  });

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Apply layout
  dagre.layout(dagreGraph);

  // Get new node positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Custom node types
const nodeTypes = {
  callBegin: CallBegin,
  pressDigits: PressDigits,
  extension: Extension,
  ringGroup: RingGroup,
  callCenter: CallCenter,
  ivr: Ivr,
  hangup: Hangup,
  backToIvr: BackToIvr,
  pstn: Pstn,
};

// Custom edgge types
const edgeTypes = {
  customEdge: CustomEdge, // Changed from 'customedge' to 'customEdge'
};

const Reactflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `${connection.source}-${connection.sourceHandle}-${connection.target}`,
        type: "customEdge",
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // auto layout the flow
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const flow = document.querySelector(".react-flow");
          if (flow) {
            flow.fitView?.();
          }
        });
      });
    },
    [nodes, edges, setNodes, setEdges]
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
    // Add the onUpdate handler to pressDigits nodes
    if (node.type === "pressDigits") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to extension nodes
    if (node.type === "extension") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to ringGroup nodes
    if (node.type === "ringGroup") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to callCenter nodes
    if (node.type === "callCenter") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to Ivr nodes
    if (node.type === "ivr") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to Hangup nodes
    if (node.type === "hangup") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to Back to IVR nodes
    if (node.type === "backToIvr") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to PSTN nodes
    if (node.type === "pstn") {
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

  // Enhanced function to export flow data with sub-nodes
  const exportFlowData = () => {
    console.log("nodes:", nodes);

    // Create a mapping of all sub-node handles for reference
    const subNodeHandleMap = {};

    nodes.forEach((node) => {
      // // Store the sub-node handle ID for each "conversation" node
      // if (node.type === "conversation" && node.data?.inputs) {
      //   node.data.inputs.forEach((input) => {
      //     // Store the sub-node handle ID
      //     subNodeHandleMap[`source-${input.id}`] = {
      //       parentNodeId: node.id,
      //       subNodeId: input.id,
      //     };
      //   });
      // }
      // Store the sub-node handle ID for each "pressDigits" node
      if (node.type === "pressDigits" && node.data?.inputs) {
        node.data.inputs.forEach((input) => {
          // Store the sub-node handle ID
          subNodeHandleMap[`source-${input.id}`] = {
            parentNodeId: node.id,
            subNodeId: input.id,
          };
        });
      }

      // Also handle dynamically added field connections
      if (node.data?.fields) {
        node.data.fields.forEach((field) => {
          subNodeHandleMap[`source-${field.id}`] = {
            parentNodeId: node.id,
            subNodeId: field.id,
          };
        });
      }
    });

    const formattedNodes = nodes.map((node) => {
      // Collect all inputs and dynamically added fields as sub-nodes
      const subNodes = [];

      // Add inputs as sub-nodes if they exist
      if (node.data?.inputs) {
        node.data.inputs.forEach((input) => {
          subNodes.push({
            id: input.id,
            parentId: node.id,
            label: input.label,
            type: input.type,
            handleId: `source-${input.id}`,
          });
        });
      }

      // // Add fields as sub-nodes if they exist (for conversation node)
      // if (node.type === "conversation" && node.data?.fields) {
      //   node.data.fields.forEach((field) => {
      //     subNodes.push({
      //       id: field.id,
      //       parentId: node.id,
      //       value: field.value,
      //       handleId: `source-${field.id}`,
      //     });
      //   });
      // }
      // Add fields as sub-nodes if they exist (for pressDigits node)
      if (node.type === "pressDigits" && node.data?.fields) {
        node.data.fields.forEach((field) => {
          subNodes.push({
            id: field.id,
            parentId: node.id,
            value: field.value,
            handleId: `source-${field.id}`,
          });
        });
      }

      return {
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          ...node.data,
          subNodes, // Include sub-node details
        },
      };
    });

    const formattedEdges = edges.map((edge) => {
      // Check if the source handle is from a sub-node
      const sourceInfo =
        edge.sourceHandle && subNodeHandleMap[edge.sourceHandle];

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        animated: edge.animated,
        // Add sub-node information if this edge connects from a sub-node
        subNodeConnection: sourceInfo
          ? {
              parentNodeId: sourceInfo.parentNodeId,
              subNodeId: sourceInfo.subNodeId,
            }
          : null,
      };
    });

    const flowData = {
      nodes: formattedNodes,
      edges: formattedEdges,
    };

    console.log("Exported Flow Data with Sub-Nodes:", flowData);
  };

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
          defaultEdgeOptions={{
            type: "customEdge",
            animated: true,
            style: { strokeWidth: 2, stroke: "#000" },
          }}
          // fitView
          snapToGrid
          connectionMode="strict"
          connectOnClick={false}
        >
          <Panel position="top-right" className="conversation-panel">
            <ConversationOptions />
            <div className="d-flex flex-col gap-2 pt-2">
              <button onClick={exportFlowData} className="btn btn-primary ">
                Export Flow Data
              </button>
              <button
                onClick={() => onLayout("LR")}
                className="btn btn-success"
              >
                Auto Layout
              </button>
            </div>
          </Panel>
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
          {/* <MiniMap /> */}
        </ReactFlow>
      </div>
    </main>
  );
};

export default Reactflow;
