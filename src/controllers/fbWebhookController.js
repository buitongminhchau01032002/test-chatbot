require('dotenv').config();
const request = require('request');

function sendMess(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        messaging_type: 'RESPONSE',
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: `https://graph.facebook.com/v19.0/${process.env.PAGE_ID}/messages`,
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
}

const getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

const postWebhook = (req, res) => {
    console.log('POST WEBHOOK');
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            console.log('entry: ' + JSON.stringify(entry));
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                sendMess(sender_psid, { text: 'Đm, bot đã trả lời' });
            } else if (webhook_event.postback) {
                sendMess(sender_psid, { text: 'Đm, bot đã trả lời' });
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook,
};
