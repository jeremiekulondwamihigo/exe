const Login = require("../Models/Login")
const asyncLib = require("async") 
const bcrypt = require("bcrypt")
const { isEmpty } = require("../Utils/Functions")
const jwtUtils = require("../Utils/jwt")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/data");
const Model_Agent = require("../Models/Agent")


module.exports = {
    Registered : function(req, res){
        try {
            const passWord_REGEX = /^(?=.*\d).{8,12}$/;
            const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            
            const { classe, commune, password, contact, e_mail, ville, ecole, nom, fonction } = req.body
            
            if(isEmpty(nom) || isEmpty(commune) || isEmpty(classe) || isEmpty(contact) || isEmpty(e_mail) 
            || isEmpty(ville) || isEmpty(ecole) || isEmpty(fonction)) {
                return res.status(200).json({
                    "message" : "Veuillez remplir les champs",
                    "error" :"warning" 
                })
            }
            if(!EMAIL_REGEX.test(e_mail)){
                return res.status(200).json({
                    "message":"E-mail incorrect",
                    "error":"warning"
                })
            }
            if(!passWord_REGEX.test(password)){
                return res.status(200).json({
                    "message":"Insérer entre 8 et 12 caractères",
                    "error":"warning"
                })
            }

            asyncLib.waterfall([
                
                function(done){
                    Login.findOne({
                        e_mail : e_mail
                    }).then(function(AgentFound){
                        if(AgentFound){
                            return res.status(200).json({
                                "message":"Adresse mail déjà utiliser",
                                "error":"warning"
                            })
                        }else{
                            done(null, AgentFound)
                        }
                    }).catch(function(error){
                        return res.status(200).json({
                            "message": error,
                            "error":"warning"
                        })
                    })
                },
                function(AgentFound, done){
                    
                        bcrypt.hash(password, 5, function(err, bcryptPassword){
                            Login.create({
                                classe, commune, password : bcryptPassword, 
                                contact, e_mail, ville, ecole, nom,
                                id : new Date(), fonction

                            }).then(function(newAgent){
                                if(newAgent){
                                    done(newAgent)
                                }else{
                                    return res.status(200).json({
                                        "message": "Erreur d'enregistrement",
                                        "error":"warning"

                                    })
                                }
                            }).catch(function(error){
                                return res.status(200).json({
                                    "message":"Erreur d'enregistrement", 
                                    "error":"warning"
                                })
                            })
                        })    
                }

            ], function(newAgent){
                if(newAgent){
                    return res.status(200).json({
                        "message":"Agent enregistrer", 
                        "error":"success"})
                }else{
                    return res.status(200).json({"message":"Erreur d'enregistrement", "error":"warning"})
                }

            })
        
        } catch (error) {
            return res.status(200).json({"message":"EndCatch :"+error, "error":"warning"})
        }
        
    },
    Login: async (req, res)=>{
  
            const { username, password } = req.body;
          
            if(isEmpty(username) || isEmpty(password)){
              return res.status(200).json({
                "message":"Veuillez renseigner les champs",
                "error":true
              });
            }
          
            try {
          
              //const user = await Model_User.aggregate([ look])
              
              const user = await Login.findOne({username}).select("+password");
              
              if(!user){
                 return res.status(200).json({
                    "message":"User not existe",
                    "error":true
                  });;
              }
          
              const isMatch = await user.matchPasswords(password);
              
             
              if(!isMatch){
                 return res.status(200).json({
                    "message":"Password not found",
                    "error":true
                  });;
              }
          
              sendToken(user, 200, res);
            } catch (error) {
              return res.status(500).json({ success : false, error: error.message
              })
            
          }
    },
    
    retournUserId : (req, res)=>{
        const { token } = req.params
        var userId = jwtUtils.getUserId(token)
        
        if(userId < 0){
            return res.status(200).json({
                "message":"Token just expired",
                "data":false
            })
        }else{
            Login.findOne({
                _id : userId
            }).then((userFound)=>{
                if(userFound){
                    return res.status(200).json({
                        "message":userFound,
                        "data":true
                    })
                }else{
                    return res.status(200).json({message:"Token just expired"})
                }
            })
        }
    },   
    ReadUser : (req, res)=>{
        let token;
        
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        
        if(isEmpty(token)){
            return  res.status(200).json({
                "authorization":false
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
            
        Model_Agent.findOne({_id : decoded.id, permission:true}).then(agent =>{
            if(agent){
                return res.status(200).json({
                    agent, "fonction" : decoded.fonction
                })
            }else{
                return res.status(200).json({
                    "authorization":false
                })
            }
        })
    } 
}
const sendToken = (user, statusCode, res)=>{
    const token = user.getSignedToken();
    res.status(statusCode).json({sucess : true, token })
}