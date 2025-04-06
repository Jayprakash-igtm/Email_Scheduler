const Agenda = require('agenda');
const nodemailer = require('nodemailer');

// Create Agenda instance with proper connection
const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: 'agendaJobs', options: { useUnifiedTopology: true } },
  maxConcurrency: 5,
  defaultConcurrency: 2
});

// Create transporter with connection pool
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  pool: true, // Use pooled connections
  maxConnections: 5, // Limit concurrent connections
  maxMessages: 100, // Limit messages per connection
  rateDelta: 1000, // Limit to 1 message per second
  rateLimit: 5, // 5 messages per rateDelta
  // Increase timeouts
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 30000 // 30 seconds
});

// Connection monitoring 
let connectionHealthy = false;

// Check connection health periodically
setInterval(async () => {
  try {
    await transporter.verify();
    if (!connectionHealthy) {
      console.log('Email connection restored');
      connectionHealthy = true;
    }
  } catch (error) {
    if (connectionHealthy) {
      console.error('Email connection lost:', error);
      connectionHealthy = false;
    }
  }
}, 60000); // Check every minute

// Define email job with improved error handling and retry logic
agenda.define('send email', { priority: 'high', concurrency: 5 }, async (job) => {
  const { to, subject, text } = job.attrs.data;
  
  try {
    // Verify connection first
    await transporter.verify();
    
    // Send email with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const result = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          text
        });
        console.log('Email sent:', result.messageId);
        return;
      } catch (error) {
        attempts++;
        console.error(`Email send attempt ${attempts} failed:`, error);
        if (attempts < maxAttempts) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Let Agenda know the job failed
  }
});

// Schedule emails based on flow
async function scheduleEmails(flow) {
  try {
    // Find the email node
    console.log("Processing flow for email scheduling");

    const emailNode = flow.nodes.find(node => node.type === 'coldEmail');
    if (!emailNode) {
      console.log("No email node found in flow");
      return;
    }

//console.log(emailNode.data.recipients)

    // Find source node with leads
    const sourceNode = flow.nodes.find(node => node.type === 'leadSource');
    if (!sourceNode || !sourceNode.data.leads || sourceNode.data.leads.length === 0) {
      console.log("No leads found in source node");
      return;
    }
    
    // Transfer leads from source node to email node recipients
    emailNode.data.recipients = [...sourceNode.data.leads];
    console.log(`Using ${emailNode.data.recipients.length} leads as recipients from source node`);

    // Find the wait node to get delay time
    const waitNode = flow.nodes.find(node => node.type === 'waitDelay');
    const delayTime = waitNode?.data?.delayTime || 0;
    const delayUnit = waitNode?.data?.delayUnit || 'hours';

    // Calculate delay in milliseconds
    let delayMs = 0;
    switch (delayUnit) {
      case 'minutes':
        delayMs = delayTime * 60 * 1000;
        break;
      case 'hours':
        delayMs = delayTime * 60 * 60 * 1000;
        break;
      case 'days':
        delayMs = delayTime * 24 * 60 * 60 * 1000;
        break;
    }

    console.log(`Scheduling emails with ${delayMs}ms delay (${delayTime} ${delayUnit})`);

    
    if (!emailNode.data.recipients || emailNode.data.recipients.length === 0) {
      console.log("No recipients found in the email node data");
      return;
    }

    let emailsScheduled = 0;

    // Schedule email for each recipient
    for (const recipient of emailNode.data.recipients) {

      const scheduledDate = new Date(Date.now() + delayMs);
      console.log(`Scheduling email to ${recipient} at ${scheduledDate}`);

      await agenda.schedule(scheduledDate, 'send email', {
        to: recipient,
        subject: emailNode.data.subject,
        text: emailNode.data.body
      });
      emailsScheduled++;
    }

    if (emailsScheduled > 0) {
      console.log(`${emailsScheduled} emails scheduled successfully`);
    } else {
      console.log("No emails were scheduled - recipient list is empty");
    }
  
  } catch (error) {
    console.error("Error scheduling emails:", error);
    throw error;
  }
}


module.exports = {
  agenda,
  scheduleEmails,
};