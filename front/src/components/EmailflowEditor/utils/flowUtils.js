import { MarkerType } from 'reactflow';
import { saveFlow } from '../../../services/api';

/**
 * Creates a node with the specified type and position
 * @param {string} type - The type of node to create
 * @param {object} position - The position coordinates {x, y}
 * @returns {object} - The created node object
 */
export const createNode = (type, position) => {
  let nodeData = {};
  
  switch(type) {
    case 'coldEmail':
      nodeData = { 
        label: 'Cold Email', 
        subject: '',
        body: '',
        recipients: []
      };
      break;
    case 'waitDelay':
      nodeData = { 
        label: 'Wait', 
        delayTime: 24,
        delayUnit: 'hours' 
      };
      break;
    case 'leadSource':
      nodeData = { 
        label: 'Lead Source',
        leads: []
      };
      break;
    default:
      nodeData = { label: type };
  }

  return {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: nodeData,
  };
};

/**
 * Creates an edge with visual properties
 * @param {object} params - Edge parameters from ReactFlow
 * @returns {object} - The configured edge object
 */
export const createEdge = (params) => {
  return {
    ...params,
    animated: true,
    style: { stroke: '#ff0072', strokeWidth: 2 },
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,  
      height: 20, 
      color: '#ff0072',
    },
  };
};

/**
 * Saves the flow data to the API
 * @param {array} nodes - The nodes array
 * @param {array} edges - The edges array
 */
export const saveFlowData = (nodes, edges) => {
  if (!nodes.length) {
    alert('No nodes to save!');
    return;
  }

  const flow = { nodes, edges };
  
  saveFlow(flow)
    .then(data => {
      console.log('Flow saved successfully:', data);
      alert('Email sequence saved successfully!');
    })
    .catch(error => {
      console.error('Error saving flow:', error);
      alert('Error saving flow.');
    });
};