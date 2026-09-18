const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


const protect  =  async(req, res, next) => {

    try {

        let token;
        //1 checking token is there or not and valid.
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token  = req.headers.authorization.split(' ')[1];
        }

        //2 what if no token found
        if(!token){
            return res.status(401).json({
                error : 'Acess Denied. No authentication token provided.',
            });
        }

        //3 Lets verify token signature and expiry.
        let decoded;
        try{
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        }catch(err){
            if(err.name === "TokenExpiredEroor"){
                return res.status(401).json({
                    error : 'Access token has expired. Please refresh your token.',
                    code : 'TOKEN_EXPIRED',
                });
            }

            return res.status(401).json({ error : 'Invalid authentication Token'});
        }

        //4. Find the user attached to this question.
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({ error: 'User belonging to this token no longer exists.' });
        }

        //5. add the user to req object
        req.user  = user;
        next();
        
    } catch (error) {
        console.error('Auth middleware error: ', error);
        return res.status(500).json({error: 'Server error in authentication middleware'})
    }
    



};

module.exports = { protect };