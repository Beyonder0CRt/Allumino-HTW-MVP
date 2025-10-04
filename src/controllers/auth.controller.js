const jwt = require('jsonwebtoken');
const { auth0Config } = require('../config/auth0');
const userService = require('../services/user.service');
const logger = require('../config/logger');

class AuthController {
  // Redirect to Auth0 login
  async login(req, res) {
    const authorizationUrl = `https://${auth0Config.domain}/authorize?` +
      `response_type=code&` +
      `client_id=${auth0Config.clientId}&` +
      `redirect_uri=${encodeURIComponent(auth0Config.callbackURL)}&` +
      `scope=openid profile email&` +
      `audience=${auth0Config.audience}`;

    res.redirect(authorizationUrl);
  }

  // Handle Auth0 callback
  async callback(req, res) {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code missing' });
      }

      // Exchange code for tokens
      const tokenResponse = await fetch(`https://${auth0Config.domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: auth0Config.clientId,
          client_secret: auth0Config.clientSecret,
          code,
          redirect_uri: auth0Config.callbackURL,
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokenResponse.ok) {
        logger.error('Token exchange failed:', tokens);
        return res.status(400).json({ error: 'Token exchange failed' });
      }

      // Get user info from id_token
      const idToken = tokens.id_token;
      const decoded = jwt.decode(idToken);

      if (!decoded) {
        return res.status(400).json({ error: 'Invalid ID token' });
      }

      // Create or update user in database
      const user = await userService.createOrUpdateUser({
        auth0Id: decoded.sub,
        email: decoded.email,
        displayName: decoded.name,
        avatarUrl: decoded.picture,
      });

      // Issue backend JWT
      const backendToken = jwt.sign(
        {
          userId: user.id,
          auth0Id: user.auth0Id,
          email: user.email,
          roles: user.roles,
        },
        process.env.SESSION_SECRET,
        { expiresIn: '7d' }
      );

      // Return token as JSON (or set as HttpOnly cookie based on preference)
      res.json({
        token: backendToken,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          roles: user.roles,
        },
      });
    } catch (error) {
      logger.error('Auth callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  // Logout
  async logout(req, res) {
    const logoutUrl = `https://${auth0Config.domain}/v2/logout?` +
      `client_id=${auth0Config.clientId}&` +
      `returnTo=${encodeURIComponent(process.env.FRONTEND_URL || 'http://localhost:3000')}`;

    res.json({ logoutUrl });
  }
}

module.exports = new AuthController();
