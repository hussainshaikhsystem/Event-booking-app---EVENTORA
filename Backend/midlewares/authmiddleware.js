const jwt = require('jsonwebtoken');
const usermodel = require('../models/usermodel.js');


// user login hai ki nhi 
const protect = async (req, res , next) => {
    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.user = await usermodel.findById(decoded.id).select('-password');
            if(!req.user){
                return res.status(401).json({message: 'not authorized , user not found'})
            }
            next()
        }catch(err){
            res.status(400).json({message: 'not authorized'})
        }
    }
      return res.status(401).json({ message: 'not authorized, no token' });
}
const admin = async (req, res , next) => {
    try{
      if(req.user && req.user.role === 'admin'){
        next()
      }
    }catch(err){
        res.status(400).json({message: 'Access denied admin only'})
    }
}
module.exports = {protect, admin};
