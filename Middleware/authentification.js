import jwt from 'jsonwebtoken'
import { ErrorResponse } from '../utilities/error.js'
import { User } from '../Models/models.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({path : './cfg.env'});


const protect = async (req, res, next) => {
    try {

      let token ;

      if (req.headers.authorization ){
        token = req.headers.authorization;
        console.log('boss');
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }
     
      
      console.log(token);//<---------------------
      //console.log(process.env.JWT_SECRET);
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
      }
  
      // Verify and decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);//<------------------------
      console.log(decoded.id);
      //console.log(decoded.userId);


      
      // Fetch user
      const user = await User.findByPk (decoded.id);
      //const user = await User.findByPk (decoded.userId);
      //console.log(user);//<--------------------------
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Set req.user
      req.user = user;
  
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  };

  
  const authorize = (...roles) => {
   // console.log(req.user.role);
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(new ErrorResponse(`User role ${req.user ? req.user.role : 'unknown'} is unauthorized to access this route`, 403));
      }
  
      next();
    }
  };

  export {protect , authorize};