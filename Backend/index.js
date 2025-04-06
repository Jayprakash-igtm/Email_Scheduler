// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const {agenda} = require('./services/emailScheduler.js');
const flowsRouter = require('./routes/flows.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://email-scheduler-pi.vercel.app/',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json());

const startServer = async () => {
  try {
    // Wait for Agenda to be ready using proper event listening
    await new Promise((resolve, reject) => {
      agenda.on('ready', resolve);
      agenda.on('error', reject);
    });
    
    // Start agenda processing
    await agenda.start();
    console.log(' Agenda started successfully');
    
    // Database connection
    await connectDB();
    
    app.use('/api', flowsRouter);

    

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
    app.use((req, res, next) => {
        // Set timeout to 30 seconds (adjust as needed)
        req.setTimeout(30000, () => {
          console.log('Request timed out');
        });
        next();
      });
    
    // Start server and store the HTTP server instance
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n Shutting down gracefully...');
      await agenda.stop();
      server.close(() => {
        console.log(' Server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
