const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const User = require('../models/user.model');


const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
  
    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }
  
    resolve();
  };

 
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next({ status: 401, msg: "Unauthorised." });
        }
        const verifyUser= await jwt.verify(token.replace('Bearer ', ''), process.env.TOKEN_KEY);
        const user = await User.findOne({ _id: verifyUser.user_id });
        if (!user) {
            return next({ status: 401, msg: "Unauthorised" });
        }
        req.user = user;
        next()
    } catch (err) {
        console.log(err)
        return next({ status: 401, msg: "Unauthorised" });
    }
  };


module.exports = auth;
  