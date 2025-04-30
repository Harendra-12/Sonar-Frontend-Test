import { useReactFlow } from "@xyflow/react";
import React from "react";

const NODE_TYPES = [
  {
    code: "pressDigits",
    name: "Press Digit",
    type: "pressDigits",
    description: "Press digits option for the user",
    icon: <i class="fa-solid fa-mobile-retro" />,
  },
];
const ConversationOptions = () => {
  const { setNodes } = useReactFlow();

  const onNodeClick = (node) => {
    console.log("Node clicked:", node);
    const location = Math.random() * 500;
    setNodes((prevNode) => [
      ...prevNode,

      {
        id: new Date().getTime(),
        type: node.type,
        position: { x: location, y: location },
        data: {
          label: node.name,
          description: node.description,
        },
      },
    ]);
  };
  return (
    <div className="conversation-options">
      <h1>Select a Node</h1>
      <ul>
        {NODE_TYPES.map((node) => (
          <li
            key={node.type}
            value={node.type}
            onClick={() => onNodeClick(node)}
          >
            {node.icon}
            <div>
              <h2>{node.name}</h2>
              <p>{node.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationOptions;
