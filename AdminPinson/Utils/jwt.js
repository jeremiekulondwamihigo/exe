const jwt = require("jsonwebtoken")

const JWT_SIGN_SECRET = "$2b$05$Vj8TH.vja/vFjLOpi7iqk./2HiAA6pStdh3q4WX/hy30hzsdyfbRO"

 module.exports = {
     generateTokenForUser: function(userData){
         return jwt.sign({
             userId: userData._id,
         },
         JWT_SIGN_SECRET,
         {
             expiresIn: '1h'
         })
     },
     parseAuthorisation : function(autorisation){
        return (autorisation != null) ? autorisation.replace('Bearer', '') : null;
     },
     getUserId : function(authorization){
        var userId = -1
        var token = module.exports.parseAuthorisation(authorization)
        if(token != null){
            try{
                let jwttoken =  jwt.verify(token, JWT_SIGN_SECRET);
                if(jwttoken != null){
                    userId = jwttoken.userId
                }
            }catch(error){
            }
        }
        return userId
     },
 }