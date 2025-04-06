import React from 'react';
import { Handle, Position } from 'reactflow';

// Cold Email Node - has input handle at top and output handle at bottom
const ColdEmailNode = ({ data }) => {
  return (
    <div className="px-4 py-2 w-[200px] rounded-md border border-gray-300 shadow-sm">
      {/* Input handle at the top - connects from Lead Source */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: '#3b82f6', 
          width: '10px', 
          height: '10px',
          top: '-5px'
        }}
        id="from-lead"
      />
      
      <div className="bg-blue-500 text-white py-1 px-2 text-center font-medium rounded-t-sm -mx-4 -mt-2">
        Cold Email
      </div>
      
      <div className="py-2 text-xs text-gray-500 text-center">
        {data.subject
          ? `Subject: ${data.subject.substring(0, 20)}${data.subject.length > 20 ? '...' : ''}`
          : 'Click to configure email'}
      </div>
      
      {/* Output handle at the bottom - connects to Wait node */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: '#3b82f6', 
          width: '10px', 
          height: '10px',
          bottom: '-5px'
        }}
        id="to-wait"
      />
    </div>
  );
};

export default ColdEmailNode;
