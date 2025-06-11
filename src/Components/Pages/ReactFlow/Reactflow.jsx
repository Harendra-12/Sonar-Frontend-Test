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
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { autoLayout } from "./utils/autoLayout";
import {
  validateAllNodeConnections,
  validatePressDigitsConnections,
} from "./utils/validateFlow";
import { toast } from "react-toastify";

// Custom node types
const nodeTypes = {
  callbegin: CallBegin,
  pressdigits: PressDigits,
  extension: Extension,
  ringgroup: RingGroup,
  queue: CallCenter,
  ivr: Ivr,
  hangup: Hangup,
  backtoivr: BackToIvr,
  pstn: Pstn,
};

// Custom edgge types
const edgeTypes = {
  customEdge: CustomEdge,
};

const Reactflow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const flowName = location.state?.name;
  const [loading, setLoading] = useState(false);
  const [initialFlowData, setInitialFlowData] = useState(null);
  const [buttonType, setButtonType] = useState("Save");
  const [initialFlowDataRefresher, setInitialFlowDataRefresher] = useState(0);
  const [initialDigitsLimit, setInitialDigitsLimit] = useState({
    max_digit: null,
    min_digit: null,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const apiData = await generalGetFunction(
        `/ivrnode/all?ivr_master_id=${id}`
      );
      if (
        apiData.status &&
        apiData?.data?.max_digit &&
        apiData?.data?.min_digit
      ) {
        setInitialDigitsLimit({
          max_digit: apiData?.data?.max_digit,
          min_digit: apiData?.data?.min_digit,
        });
      }

      if (
        apiData.status &&
        apiData?.data &&
        apiData?.data?.nodes.length > 0 &&
        apiData?.data?.edges.length > 0
      ) {
        setInitialFlowData(apiData.data);
        if (apiData.data?.nodes.length > 2) {
          setButtonType("Update");
        }
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

  useEffect(() => {
    if (initialFlowDataRefresher > 0) {
      fetchData();
    }
  }, [initialFlowDataRefresher]);

  // Update nodes and edges when initialFlowData changes
  useEffect(() => {
    if (initialFlowData?.nodes && initialFlowData?.edges) {
      setNodes(initialFlowData.nodes);
      setEdges(initialFlowData.edges);
    }
  }, [initialFlowData, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        // Check if an edge already exists from the same source and sourceHandle
        const edgeExists = eds.some(
          (edge) =>
            edge.source === connection.source &&
            edge.sourceHandle === connection.sourceHandle
        );

        if (edgeExists) {
          toast.error("Only one edge allowed from this source and handle.");
          return eds; // Return existing edges without adding new one
        }

        // Create new edge with custom properties
        const newEdge = {
          ...connection,
          animated: true,
          id: `${connection.source}-${connection.sourceHandle}-${connection.target}`,
          type: "customEdge",
          isRemovable: true,
          deletable: true,
        };

        // Add the new edge
        return addEdge(newEdge, eds);
      });
    },
    [setEdges]
  );

  // const onConnect = useCallback(
  //   (connection) => {
  //     const edge = {
  //       ...connection,
  //       animated: true,
  //       id: `${connection.source}-${connection.sourceHandle}-${connection.target}`,
  //       type: "customEdge",
  //       isRemovable: true,
  //       deletable: true,
  //     };
  //     setEdges((eds) => addEdge(edge, eds));
  //   },
  //   [setEdges]
  // );

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
      case "pressdigits":
      case "extension":
      case "ringgroup":
      case "queue":
      case "ivr":
      case "hangup":
      case "backtoivr":
      case "pstn":
        return {
          ...node,
          data: {
            ...node.data,
            main_id: node.main_id,
            // set default value, mainly use on the pressdigits node.
            initialDigitsLimit: initialDigitsLimit,
            setInitialFlowDataRefresher: () =>
              setInitialFlowDataRefresher(initialFlowDataRefresher + 1),
            onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
          },
        };
      default:
        return node;
    }
  });

  const exportFlowData = async () => {
    setLoading(true);
    const flowData = { nodes, edges };

    const isPressDigitsValid = validatePressDigitsConnections(flowData);
    const isConnectedValid = validateAllNodeConnections(flowData);
    console.log("flowData: ", flowData);

    if (!isPressDigitsValid || !isConnectedValid) {
      setLoading(false);
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
      toast.success(apiData?.message || "IVR created successfully.");
      // navigate("/ivr");
      // backToTop();
    } else {
      setLoading(false);
    }

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
          <div>
            <h2
              style={{
                color: "white",
                fontSize: "20px",
                marginLeft: "10px",
                paddingTop: "5px",
              }}
            >
              Options for IVR:{" "}
              <span style={{ color: "var(--ui-accent)" }}>{flowName}</span>
            </h2>
          </div>
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
            style={{ height: "100vh", maxHeight: "95%" }}
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
              <div className="pt-3 w-100">
                <button
                  onClick={exportFlowData}
                  className="panelButton static w-100"
                >
                  <span className="text">{buttonType}</span>
                </button>
                <button
                  onClick={() => onLayout("LR")}
                  className="panelButton static w-100 edit mt-2"
                >
                  <span className="text">Auto Layout</span>
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
