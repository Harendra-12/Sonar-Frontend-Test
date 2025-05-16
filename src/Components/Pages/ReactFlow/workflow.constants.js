export const initialNodes = [
  {
    id: "7",
    position: { x: 255, y: 210 },
    type: "callBegin",
    selected: false,
    dragging: false,
  },
  {
    id: "8",
    position: { x: 600, y: 200 },
    type: "pressDigits",
    data: {
      label: "Press Digits",
      description: "Press digits for new task",
    },
  },
];

export const initialEdges = [
  {
    id: "e1-2",
    source: "7",
    target: "8",
    animated: true,
    type: "customEdge",
    style: { strokeWidth: 2, stroke: "#000" },
    isRemovable: false,
    deletable: false,
  },
];
