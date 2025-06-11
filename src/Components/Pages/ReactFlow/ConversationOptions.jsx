import { useReactFlow } from "@xyflow/react";
import React from "react";

const NODE_TYPES = [
  // {
  //   code: "pressDigits",
  //   name: "Press Digit",
  //   type: "pressDigits",
  //   description: "Press digits option for the user",
  //   icon: <i className="fa-solid fa-mobile-retro" />,
  // },
  {
    code: "extension",
    name: "Extension",
    type: "extension",
    description: "Extension option for the user",
    icon: <i className="fa-light fa-phone-volume"></i>,
  },
  {
    code: "ringGroup",
    name: "Ring Group",
    type: "ringgroup",
    description: "Ring group option for the user",
    icon: <i className="fa-light fa-headset"></i>,
  },
  {
    code: "callCenter",
    name: "Call Center",
    type: "queue",
    description: "Call Center option for the user",
    icon: <i className="fa-light fa-users"></i>,
  },
  {
    code: "ivr",
    name: "Ivr",
    type: "ivr",
    description: "IVR option for the user",
    icon: <i className="fa-light fa-user-tie"></i>,
  },
  {
    code: "hangup",
    name: "Hangup",
    type: "hangup",
    description: "Hangup option for the user",
    icon: <i className="fa-light fa-phone-slash"></i>,
  },
  {
    code: "backtoivr",
    name: "Back To Ivr",
    type: "backtoivr",
    description: "Back To Ivr option for the user",
    icon: <i className="fa-light fa-rotate-left"></i>,
  },
  {
    code: "pstn",
    name: "PSTN",
    type: "pstn",
    description: "PSTN option for the user",
    icon: <i className="fa-light fa-earth-americas"></i>,
  },
];
const ConversationOptions = () => {
  const { setNodes } = useReactFlow();

  const onNodeClick = (node) => {
    const position = {
      x: Math.random() * 500,
      y: Math.random() * 300,
    };
    const newNode = {
      id: `node_${Date.now()}`,
      type: node.type,
      position,
      data: {
        label: node.name,
        description: node.description,
      },
      draggable: true,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
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
