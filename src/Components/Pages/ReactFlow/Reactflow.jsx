import React, { useCallback, useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { autoLayout } from "./utils/autoLayout";
import {
  validateAllNodeConnections,
  validatePressDigitsConnections,
} from "./utils/validateFlow";

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
  customEdge: CustomEdge,
};

const Reactflow = () => {
  const location = useLocation();
  const id = location.state?.id;
  const [loading, setLoading] = useState(false);
  const [initialFlowData, setInitialFlowData] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const apiData = await generalGetFunction(
        `/ivrnode/all?ivr_master_id=${id}`
      );

      if (apiData.status && apiData?.data) {
        setInitialFlowData(apiData.data);
      }
    } catch (error) {
      console.error("Error fetching flow data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!initialFlowData && id) {
      fetchData();
    }
  }, [fetchData, initialFlowData, id]);

  // Update nodes and edges when initialFlowData changes
  useEffect(() => {
    if (initialFlowData?.nodes && initialFlowData?.edges) {
      setNodes(initialFlowData.nodes);
      setEdges(initialFlowData.edges);
    }
  }, [initialFlowData, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `${connection.source}-${connection.sourceHandle}-${connection.target}`,
        type: "customEdge",
        isRemovable: true,
        deletable: true,
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // auto layout the flow
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        // getLayoutedElements(nodes, edges, direction);
        autoLayout(nodes, edges, direction);
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
    switch (node.type) {
      case "pressDigits":
      case "extension":
      case "ringGroup":
      case "callCenter":
      case "ivr":
      case "hangup":
      case "backToIvr":
      case "pstn":
        return {
          ...node,
          data: {
            ...node.data,
            onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
          },
        };
      default:
        return node;
    }
  });

  const exportFlowData = async () => {
    const flowData = { nodes, edges };

    const isPressDigitsValid = validatePressDigitsConnections(flowData);
    const isConnectedValid = validateAllNodeConnections(flowData);
    console.log("flowData: ", flowData);

    if (!isPressDigitsValid || !isConnectedValid) {
      console.warn("❌ Export aborted due to validation failure.");
      return;
    }

    function replaceIdWithKeyId(obj) {
      if (Array.isArray(obj)) {
        return obj.map(replaceIdWithKeyId);
      } else if (obj !== null && typeof obj === "object") {
        return Object.entries(obj).reduce((acc, [key, value]) => {
          const newKey = key === "id" ? "key_id" : key;
          acc[newKey] = replaceIdWithKeyId(value);
          return acc;
        }, {});
      }
      return obj;
    }

    const updated = replaceIdWithKeyId(flowData);
    const payload = {
      ivr_master_id: id,
      ...updated,
    };

    const apiData = await generalPostFunction("/ivrnode/store", payload);
    if (apiData.status) {
      setLoading(false);
    } else {
      setLoading(false);
      // alert("Something went wrong");
    }

    console.log("✅ All validations passed.");
    console.log("📦 Final Exported Flow:", payload);
  };

  return (
    <>
      {loading ? (
        <div colSpan={99}>
          <CircularLoader />
        </div>
      ) : (
        ""
      )}
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
            connectOnClick={true}
            style={{ height: "100vh" }}
            defaultEdgeOptions={{
              type: "customEdge",
              animated: true,
              style: { strokeWidth: 2, stroke: "#000" },
            }}
            // fitView
            snapToGrid
            connectionMode="strict"
          >
            <Panel position="top-right" className="conversation-panel">
              <ConversationOptions />
              <div className="d-flex flex-col gap-2 pt-2">
                <button onClick={exportFlowData} className="btn btn-primary ">
                  Save
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
    </>
  );
};

export default Reactflow;
