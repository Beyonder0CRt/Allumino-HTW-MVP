const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  callbackURL: process.env.AUTH0_CALLBACK_URL,
};

// Middleware to verify Auth0 access tokens
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Config.domain}/.well-known/jwks.json`,
  }),
  audience: auth0Config.audience,
  issuer: `https://${auth0Config.domain}/`,
  algorithms: ['RS256'],
  credentialsRequired: false,
});

module.exports = {
  auth0Config,
  checkJwt,
};
