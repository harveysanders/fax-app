const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER,
  CALLER_ID_NUMBER,
} = process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendFax = ({ mediaUrl, to }) => {
  return client.fax.faxes
    .create({
      from: CALLER_ID_NUMBER,
      to,
      mediaUrl,
    });
};

module.exports = {
  sendFax,
};
