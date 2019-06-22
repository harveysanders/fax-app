require('dotenv').config();
const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { PORT = 8080 } = process.env;
const { sendFax } = require('./twilio');

const app = express();

// Parse any incoming POST parameters
app.use(bodyParser({ extended: false }));
app.use(express.static(path.join(__dirname, '../test_faxes/pdfs')));

// Define a handler for when the fax is initially sent
app.post('/fax/sent', (req, res) => {
  // Let's manually build some TwiML. We can choose to receive the
  // fax with <Receive>, or reject with <Reject>.
  console.log('Fax sent', req.body);

  const twiml = `
  <Response>
    <Receive action="/fax/received"/>
  </Response>
  `;

  // Send Fax twiml response
  res.type('text/xml');
  res.send(twiml);
});

// Define a handler for when the fax is finished sending to us - if successful,
// We will have a URL to the contents of the fax at this point
app.post('/fax/received', (req, res) => {
  // log the URL of the PDF received in the fax
  console.log(req.body.MediaUrl);

  // Respond with empty 200/OK to Twilio
  res.status(200);
  res.send();
});

app.post('/fax', (req, res) => {
  sendFax(req.body)
    .then((fax) => {
      res.send(fax.sid);
    }).catch((err) => {
      console.error(err);
      res.send(500);
    });
});


// Start the web server
http.createServer(app).listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
