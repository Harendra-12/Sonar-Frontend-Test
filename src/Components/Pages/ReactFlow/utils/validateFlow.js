export const validatePressDigitsConnections = (flowData) => {
  const { nodes, edges } = flowData;
  const errors = [];

  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const subNodeEdgeMap = {};
  const subNodeToTarget = {};

  console.log("🔍 Validating pressDigits nodes...");

  // Map edges with sourceHandles for subnodes
  edges.forEach((edge) => {
    if (edge.sourceHandle) {
      subNodeEdgeMap[edge.sourceHandle] = edge;
      subNodeToTarget[edge.sourceHandle] = edge.target;
    }
  });

  nodes.forEach((node) => {
    if (node.type === "pressDigits") {
      // Build subNodes from fields if subNodes not present
      const subNodes =
        node.data?.subNodes ||
        node.data?.fields?.map((field) => ({
          id: field.id,
          parentId: node.id,
          value: field.value,
          handleId: `source-${field.id}`,
        })) ||
        [];

      subNodes.forEach((subNode) => {
        const handleId = `source-${subNode.id}`;
        const targetId = subNodeToTarget[handleId];

        // Check 1: value is not empty or undefined (but allow '0')
        if (
          subNode.value === undefined ||
          subNode.value === null ||
          (typeof subNode.value === "string" && subNode.value.trim() === "")
        ) {
          errors.push(
            `❌ Subnode '${handleId}' (ID ${subNode.id}) has an empty value.`
          );
        } else {
          console.log(`✅ Subnode '${handleId}' has value '${subNode.value}'`);
        }

        // Check 2: must be connected
        if (!targetId) {
          errors.push(
            `❌ Subnode '${handleId}' is not connected to any target node.`
          );
        } else {
          console.log(`✅ Subnode '${handleId}' is connected to '${targetId}'`);
        }

        // Check 3: target must exist
        if (targetId && !nodeMap[targetId]) {
          errors.push(
            `❌ Subnode '${handleId}' connects to unknown target '${targetId}'`
          );
        }
      });
    }
  });

  // Check 4: unique connections (no two subnodes to same target)
  const connectedTargets = Object.values(subNodeToTarget);
  const duplicates = connectedTargets.filter(
    (t, i, arr) => arr.indexOf(t) !== i
  );

  if (duplicates.length > 0) {
    errors.push(
      `❌ Duplicate connections found to: ${[...new Set(duplicates)].join(
        ", "
      )}`
    );
  } else {
    console.log("✅ All subnodes connect to unique targets.");
  }

  if (errors.length > 0) {
    console.error("🚫 Validation Errors:\n" + errors.join("\n"));
    alert("Validation Failed. See console for details.");
    return false;
  }

  console.log("✅ Validation Passed!");
  return true;
};

export const validateAllNodeConnections = (flowData) => {
  const { nodes, edges } = flowData;
  const errors = [];

  // Collect all connected node IDs
  const connectedNodeIds = new Set();
  edges.forEach((edge) => {
    if (edge.source) connectedNodeIds.add(edge.source);
    if (edge.target) connectedNodeIds.add(edge.target);
  });

  // Check each node for connection
  nodes.forEach((node) => {
    if (!connectedNodeIds.has(node.id)) {
      errors.push(
        `❌ Node '${node.id}' (${node.type}) is not connected to any other node.`
      );
    }
  });

  if (errors.length > 0) {
    console.error("🚫 Unconnected Node Errors:\n" + errors.join("\n"));
    alert("Disconnected nodes found! See console for details.");
    return false;
  }

  console.log("✅ All nodes are properly connected.");
  return true;
};
