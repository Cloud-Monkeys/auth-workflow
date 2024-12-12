const express = require('express');
const router = express.Router();
const AuthWorkflow = require('../workflows/AuthWorkflow');

router.post('/register', async (req, res) => {
    try {
        const workflow = new AuthWorkflow();
        const result = await workflow.executeRegistrationFlow(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const workflow = new AuthWorkflow();
        const result = await workflow.executeLoginFlow(req.body);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});
router.post('/register', async (req, res) => {
  console.log('Register route hit:', req.body);  // Add this line
  try {
      const workflow = new AuthWorkflow();
      const result = await workflow.executeRegistrationFlow(req.body);
      res.json(result);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});
module.exports = router;