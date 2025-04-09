import { useReactFlow } from "@xyflow/react";
import React from "react";
import { v4 as uuid4 } from "uuid";

const NODE_TYPES = [
  {
    code: "conversation",
    name: "Conversation",
    type: "conversation",
    icon: <i class="fa-solid fa-messages"></i>,
    description: "Add a conversation node",
  },
  {
    code: "function",
    name: "Custom Function",
    type: "function",
    icon: <i class="fa-solid fa-function"></i>,
    description: "Add a custom function node",
  },
  {
    code: "callTransfer",
    name: "Call Transfer",
    type: "callTransfer",
    icon: <i class="fa-solid fa-phone-arrow-up-right"></i>,
    description: "Transfer the call to another agent",
  },
  {
    code: "pressDigit",
    name: "Press Digit",
    type: "pressDigit",
    icon:<i class="fa-solid fa-keyboard"></i>,
    description: "Press digits option to user",
  },
  {
    code: "callEnd",
    name: "Call End",
    type: "callEnd",
    icon: <i class="fa-solid fa-phone-slash"></i>,
    description: "End the call flow",
  },
];

// Function to check added nodes and add its position on the UI

function checkAddedNodes(nodeType) {
  if(nodeType === "pressDigit"){
    return ({ x: 86, y: 354 })
  }
}

const ConversationOptions = () => {
  const { setNodes } = useReactFlow();

  const onNodeClick = (nodeType) => {
    const location = Math.random() * 500;
    console.log("Node clicked:", nodeType);
    
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: nodeType.code,
        type: nodeType.type,
        position: checkAddedNodes(nodeType.code) || { x: location, y: location },
        data: {
          label: nodeType.name,
          description: nodeType.description,
        },
      },
    ]);
  };

  return (
    <div className="card w-100">
      <h2 className="card-title">Select a node</h2>
      <ul className="list-group list-group-flush">
        {NODE_TYPES.map((node) => (
          <li
            className="list-group-item list-group-item-action d-flex align-items-center"
            key={node.code}
            value={node.code}
            onClick={() => onNodeClick(node)}
          >
            {node.icon}
            <div className="ms-2">
              <h5 className="mb-1">{node.name}</h5>
              <small className="text-muted">{node.description}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationOptions;