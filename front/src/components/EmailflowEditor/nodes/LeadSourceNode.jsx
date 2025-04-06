import React from 'react';
import { Handle, Position } from 'reactflow';

// Lead Source Node - has output handle at the bottom
const LeadSourceNode = ({ data }) => {
  return (
    <div className="px-4 py-2 w-[200px] rounded-md border border-gray-300 shadow-sm">
      <div className="bg-emerald-500 text-white py-1 px-2 text-center font-medium rounded-t-sm -mx-4 -mt-2">
        Lead Source
      </div>
      
      <div className="py-2 text-xs text-gray-500 text-center">
        {data.leads && data.leads.length
          ? `${data.leads.length} leads configured`
          : 'Click to configure leads'}
      </div>
      
      {/* Output handle at the bottom - this connects to Cold Email */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#10b981',
          width: '10px',
          height: '10px',
          bottom: '-5px',
          zIndex: 10,
          borderRadius: '50%',
          border: '2px solid white'
        }}
        id="to-email"
      />
    </div>
  );
};

export default LeadSourceNode;
