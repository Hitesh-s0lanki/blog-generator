import React, { useCallback, useRef, useEffect } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type OnNodeDrag,
  useReactFlow,
  type Node,
  type Edge,
  type DefaultEdgeOptions,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const defaultEdgeOptions: DefaultEdgeOptions = {
  interactionWidth: 75,
};

// Define horizontal and vertical layouts
const horizontalLayout: Node[] = [
  {
    id: "start",
    type: "input",
    data: { label: "Start" },
    position: { x: 0, y: 150 },
  },
  {
    id: "title_creation",
    data: { label: "Title Creation" },
    position: { x: 200, y: 150 },
  },
  {
    id: "content_generation",
    data: { label: "Content Generation" },
    position: { x: 400, y: 150 },
  },
  {
    id: "content_validation",
    data: { label: "Content Validation" },
    position: { x: 550, y: 40 },
  },
  {
    id: "image_generation",
    data: { label: "Image Generation" },
    position: { x: 700, y: 150 },
  },
  {
    id: "end",
    type: "output",
    data: { label: "End" },
    position: { x: 900, y: 150 },
  },
];

const verticalLayout = horizontalLayout.map((node, idx) => ({
  ...node,
  position: { x: node.id == "content_validation" ? 250 : 150, y: idx * 120 },
}));

const initialEdges: Edge[] = [
  { id: "e1", source: "start", target: "title_creation", animated: true },
  {
    id: "e2",
    source: "title_creation",
    target: "content_generation",
    animated: true,
  },
  {
    id: "e3",
    source: "content_generation",
    target: "content_validation",
    animated: true,
  },
  {
    id: "e4",
    source: "content_validation",
    target: "image_generation",
    label: "Content valid more than 70%",
    animated: true,
    style: { stroke: "green", strokeWidth: 2 },
    labelStyle: { fill: "green", fontWeight: 600 },
    labelBgStyle: {
      fill: "white",
      fillOpacity: 0.8,
      borderRadius: 4,
    },
  },
  {
    id: "e5",
    source: "content_validation",
    target: "content_generation",
    label: "Content Valid less then 70%",
    animated: true,
    style: { stroke: "red", strokeWidth: 2, strokeDasharray: "4 2" },
    labelStyle: { fill: "red", fontWeight: 600 },
    labelBgStyle: {
      fill: "white",
      fillOpacity: 0.8,
      borderRadius: 4,
    },
  },
  { id: "e6", source: "image_generation", target: "end", animated: true },
];

const WorkflowExample = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(horizontalLayout);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle responsive layout
  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth < 768;
      setNodes(mobile ? verticalLayout : horizontalLayout);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [setNodes]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const { updateEdge, getEdge, addEdges } = useReactFlow();
  const overlappedEdgeRef = useRef<string | null>(null);

  const onNodeDragStop: OnNodeDrag = useCallback(
    (event, node) => {
      const edgeId = overlappedEdgeRef.current;
      if (!edgeId) return;
      const edge = getEdge(edgeId);
      if (!edge) return;

      updateEdge(edgeId, { source: edge.source, target: node.id, style: {} });
      addEdges({
        id: `${node.id}->${edge.target}`,
        source: node.id,
        target: edge.target,
      });
      overlappedEdgeRef.current = null;
    },
    [getEdge, addEdges, updateEdge]
  );

  const onNodeDrag: OnNodeDrag = useCallback(
    (e, node) => {
      const nodeDiv = document.querySelector(
        `.react-flow__node[data-id=${node.id}]`
      );
      if (!nodeDiv) return;

      const rect = nodeDiv.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const edgeFound = document
        .elementsFromPoint(centerX, centerY)
        .find((el) =>
          el.classList.contains("react-flow__edge-interaction")
        )?.parentElement;

      const edgeId = edgeFound?.dataset.id;
      if (edgeId) updateEdge(edgeId, { style: { stroke: "black" } });
      else if (overlappedEdgeRef.current)
        updateEdge(overlappedEdgeRef.current, { style: {} });

      overlappedEdgeRef.current = edgeId || null;
    },
    [updateEdge]
  );

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onNodeDrag={onNodeDrag}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView>
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default WorkflowExample;
