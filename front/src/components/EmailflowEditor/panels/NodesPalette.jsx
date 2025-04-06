import React from 'react';

const NodesPalette = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white p-3 rounded-md shadow-md">
      <div className="font-bold text-base mb-3 text-gray-800">Email Flow Nodes</div>
      
      <div
        className="p-2 mb-2 bg-white border border-gray-300 rounded cursor-grab hover:bg-gray-50 transition-colors text-sm"
        onDragStart={(e) => onDragStart(e, 'leadSource')}
        draggable
      >
        Lead Source
      </div>
      
      <div
        className="p-2 mb-2 bg-white border border-gray-300 rounded cursor-grab hover:bg-gray-50 transition-colors text-sm"
        onDragStart={(e) => onDragStart(e, 'coldEmail')}
        draggable
      >
        Cold Email
      </div>
      
      <div
        className="p-2 mb-2 bg-white border border-gray-300 rounded cursor-grab hover:bg-gray-50 transition-colors text-sm"
        onDragStart={(e) => onDragStart(e, 'waitDelay')}
        draggable
      >
        Wait/Delay
      </div>
    </div>
  );
};

export default NodesPalette;