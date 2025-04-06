import LeadSourceNode from './LeadSourceNode';
import ColdEmailNode from './ColdEmailNode';
import WaitNode from './WaitNode';

// Export node types mapping
export const nodeTypes = {
  leadSource: LeadSourceNode,
  coldEmail: ColdEmailNode,
  waitDelay: WaitNode,
};

// Export individual node components for direct usage
export {
  LeadSourceNode,
  ColdEmailNode,
  WaitNode
};