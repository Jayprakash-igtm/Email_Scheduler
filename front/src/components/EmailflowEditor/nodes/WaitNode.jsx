import React from 'react';
import { Handle, Position } from 'reactflow';

// Wait/Delay Node - has input handle at top
const WaitNode = ({ data }) => {
  return (
    <div className="px-4 py-2 w-[200px] rounded-md border border-gray-300 shadow-sm">
      {/* Input handle at the top - connects from Cold Email */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: '#6b7280', 
          width: '10px', 
          height: '10px',
          top: '-5px'
        }}
        id="from-email"
      />
      
      <div className="bg-gray-500 text-white py-1 px-2 text-center font-medium rounded-t-sm -mx-4 -mt-2">
        Wait/Delay
      </div>
      
      <div className="py-2 text-xs text-gray-500 text-center">
        {data.delayTime && data.delayUnit
          ? `Wait for ${data.delayTime} ${data.delayUnit}`
          : 'Wait for 24 hours'}
      </div>
      
      {/* Optional: Output handle if you need to connect this to another node later */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: '#6b7280', 
          width: '10px', 
          height: '10px',
          bottom: '-5px'
        }}
        id="to-next"
      />
    </div>
  );
};

export default WaitNode;