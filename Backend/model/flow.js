
const mongoose = require('mongoose');

const FlowSchema = new mongoose.Schema({
  nodes: {
    type: [{
      id: { type: String, required: true },
      type: { type: String, required: true },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
      },
      data: {
        label: { type: String, default: '' },
        leads: { type: [String], default: [] },
        subject: { type: String, default: '' },
        body: { type: String, default: '' },
        delayTime: { type: Number, default: 0 },
        delayUnit: { 
          type: String, 
          enum: ['minutes', 'hours', 'days'], 
          default: 'hours' 
        },
        recipients: { type: [String], default: [] }
      },
      width: { type: Number, default: 200 },
      height: { type: Number, default: 73 },
      // Add these to accept ReactFlow fields
      selected: { type: Boolean, default: false },
      positionAbsolute: {
        x: { type: Number },
        y: { type: Number }
      },
      dragging: { type: Boolean, default: false }
    }],
    validate: {
      validator: function(nodes) {
        return Array.isArray(nodes) && nodes.length > 0;
      },
      message: 'Nodes must be a non-empty array'
    }
  },
  edges: {
    type: [{
      source: { type: String, required: true },
      sourceHandle: { type: String, default: '' },
      target: { type: String, required: true },
      targetHandle: { type: String, default: '' },
      animated: { type: Boolean, default: false },
      style: {
        stroke: { type: String, default: '#888' },
        strokeWidth: { type: Number, default: 2 }
      },
      type: { type: String, default: 'default' },
      markerEnd: {
        type: { type: String, default: 'arrowclosed' },
        width: { type: Number, default: 20 },
        height: { type: Number, default: 20 },
        color: { type: String, default: '#888' }
      },
      // Add edge ID field
      id: { type: String }
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  
  strict: false, 
  
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

 const Flow = mongoose.model('Flow', FlowSchema);                    

 module.exports = Flow;