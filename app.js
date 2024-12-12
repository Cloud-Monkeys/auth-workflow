// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const authRouter = require('./src/routes/authRoutes');  // Import directly

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'src/views')));

// // Routes - use the router directly
// app.use('/', authRouter);  // <-- Fixed line

// // Port configuration
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// app.js
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const authRouter = require('./src/routes/authRoutes');

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'src/views')));

// Configure logging
const logFilePath = path.join(__dirname, 'log.json');
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, JSON.stringify([]));
}

// Tracing middleware
app.use((req, res, next) => {
  const traceId = req.headers['x-trace-id'] || uuidv4();
  const spanId = uuidv4();
  req.headers['x-trace-id'] = traceId;

  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    traceId,
    spanId,
    statusCode: 0
  };

  console.log(`[TRACE] Request Received`);
  console.log(`  Method: ${logEntry.method}`);
  console.log(`  URL: ${logEntry.url}`);
  console.log(`  TraceId: ${logEntry.traceId}`);
  console.log(`  SpanId: ${logEntry.spanId}`);

  res.on('finish', () => {
    logEntry.statusCode = res.statusCode;

    console.log(`[TRACE] Response Sent`);
    console.log(`  Status Code: ${logEntry.statusCode}`);
    console.log(`  TraceId: ${logEntry.traceId}`);
    console.log(`  SpanId: ${logEntry.spanId}`);

    try {
      const currentLogs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
      currentLogs.push(logEntry);
      fs.writeFileSync(logFilePath, JSON.stringify(currentLogs, null, 2));
    } catch (err) {
      console.error('Failed to write log to log.json:', err);
    }
  });

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'active'
    }
  });
});

// Routes
app.use('/', authRouter);

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});