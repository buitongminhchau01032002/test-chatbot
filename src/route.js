const express = require('express');

const fbWebhookController = require('./controllers/fbWebhookController');

const router = express.Router();

router.post('/webhook', fbWebhookController.postWebhook);
router.get('/webhook', fbWebhookController.getWebhook);

module.exports = router;
