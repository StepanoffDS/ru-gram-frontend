import 'dotenv/config';

module.exports = {
  service: {
    endpoint: {
      url: process.env.NEXT_PUBLIC_SERVER_URL,
      wsEndpoint: process.env.NEXT_PUBLIC_SUBSCRIPTIONS_URL,
      skipSSLValidation: true,
    },
  },
};
