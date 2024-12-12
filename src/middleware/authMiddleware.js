const authMiddleware = (req, res, next) => {
  // Add workflow context to request
  req.workflowContext = {
    startTime: new Date(),
    requestId: Math.random().toString(36).substring(7)
  };

  // Log workflow states
  req.on('workflowState', (state) => {
    console.log(`[${req.workflowContext.requestId}] Workflow State: ${state}`);
  });

  next();
};

module.exports = authMiddleware;