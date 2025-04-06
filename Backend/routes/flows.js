// routes/flows.js
const express = require('express');
const Flow = require('../model/flow.js');
const {scheduleEmails} = require('../services/emailScheduler.js')

const router = express.Router();


router.post('/setflow', async (req, res) => {
    try {
     
      
      // Parse if body is stringified
      let parsedBody = req.body;
      if (typeof req.body === 'string') {
        try {
          parsedBody = JSON.parse(req.body);
        } catch (parseErr) {
          return res.status(400).json({
            error: 'Invalid JSON format',
            details: parseErr.message
          });
        }
      }
  
      // Validate nodes and edges structure
      if (!Array.isArray(parsedBody.nodes)) {
        return res.status(400).json({
          error: 'Nodes must be an array',
          received: typeof parsedBody.nodes
        });
      }
  
      // Create flow document
      const flow = new Flow(parsedBody);
    
      //console.log("Flow object:", JSON.stringify(flow, null, 2));

      // Save to database
      await flow.save();
      
      // Schedule emails
      await scheduleEmails(flow);
      
      res.status(201).json({
        success: true,
        flowId: flow._id,
        nodes: flow.nodes,
        edges: flow.edges
      });
  
    } catch (err) {
      console.error('Server error:', err);
      res.status(400).json({
        error: 'Validation failed',
        details: err.message
      });
    }
  });


router.get('/getflow', async (req, res) => {
  try {
    const flows = await Flow.find();
    res.json(flows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get flow by ID
router.get('/getflowbyid/:id', async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.id);
    if (!flow) return res.status(404).json({ message: 'Flow not found' });
    res.json(flow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;