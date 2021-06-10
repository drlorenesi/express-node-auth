// Middleware that expects an array of roleId's that are allowed to access a resource.
// Example: [restrict([1, 2, 3, ...])]
const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const User = require('../models/user');
const createTokens = require('../utils/createTokens');

module.exports = (param) => {
  return async (req, res, next) => {
    // Check if ACCESS TOKEN exits (with optional chaining to avoid server error)
    if (req?.cookies?.accessToken) {
      // console.log('accessToken detected...');
      // Decode access token
      const { accessLevel, userId } = jwt.verify(
        req.cookies.accessToken,
        process.env.JWT_SIGNATURE
      );
      // Get userId
      res.locals.userId = userId;
      // Do auth check with user info here...
      if (!param.includes(accessLevel))
        return res.status(403).send({ message: 'Access denied.' });
      next();
    }

    // Check if REFRESH TOKEN exits (with optional chaining to avoid server error)
    else if (req?.cookies?.refreshToken) {
      // console.log('refreshToken detected...');
      // Decode refresh token
      const { sessionId } = jwt.verify(
        req.cookies.refreshToken,
        process.env.JWT_SIGNATURE
      );
      // Get session info
      const session = await Session.findOne({ sessionId });
      if (!session || !session.valid)
        return res
          .status(401)
          .send({ message: 'Access denied. Please log in.' });
      // If session is valid, look up user info
      const user = await User.findOne({ _id: session.user._id });
      // Create refresh tokens and get userId
      createTokens(sessionId, user, res);
      res.locals.userId = user._id;
      // Do auth check with user info here...
      if (!param.includes(user.accessLevel))
        return res.status(403).send({ message: 'Access denied.' });
      next();
    } else {
      return res.status(401).send({ message: 'Access denied. Please log in.' });
    }
  };
};
