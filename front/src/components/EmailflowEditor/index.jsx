import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import node types
import { nodeTypes } from './nodes';

// Import panels
import { NodesPalette, EditPanel } from './panels';

// Import utilities
import { createEdge, createNode, saveFlowData } from './utils/flowUtils';

const initialNodes = [
  {
    id: 'start',
    type: 'leadSource',
    position: { x: 250, y: 50 },
    data: { label: 'Lead Source', leads: [] },
  },
];

const initialEdges = [];

const EmailFlowEditor = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showEditPanel, setShowEditPanel] = useState(false);
  
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  const onConnect = useCallback(
    (params) => {
        console.log('Creating edge:', params);
      setEdges((eds) => addEdge(createEdge(params), eds));
    },
    [setEdges]
  );



  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = createNode(type, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowEditPanel(true);
  }, []);

  const updateNodeData = useCallback((newData) => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      })
    );
  }, [selectedNode, setNodes]);

  const saveFlow = useCallback(() => {
    if (!nodes.length) return;
    saveFlowData(nodes, edges);
  }, [nodes, edges]);

  const closeEditPanel = useCallback(() => {
    setShowEditPanel(false);
  }, []);
 
  return (
    <div className="font-sans w-full h-[700px]">
      <ReactFlowProvider>
        <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={memoizedNodeTypes}
            onNodeClick={onNodeClick}
            fitView
            defaultzoom={1.2}
            
          >
            <Controls />
            <Background color="#aaa" gap={12} size={1} variant="dots" />
            
            {/* Nodes palette panel */}
            <Panel position="top-left">
              <NodesPalette />
            </Panel>
            
            {/* Save button */}
            <Panel position="top-right">
              <button 
                onClick={saveFlow} 
                className="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-600 transition-colors"
              >
                Save & Schedule Emails
              </button>
            </Panel>
            
            {/* Node edit panel */}
            {showEditPanel && selectedNode && (
              <Panel position="bottom-right">
                <EditPanel 
                  node={selectedNode} 
                  onClose={closeEditPanel} 
                  updateNodeData={updateNodeData} 
                />
              </Panel>
            )}
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default EmailFlowEditor;

