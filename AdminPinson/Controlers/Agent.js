const Agent = require("../Models/Agent")
const asyncLib = require("async") 
const bcrypt = require("bcrypt")
var jwtUtils = require("../Utils/jwt")
var modelClasse = require("../Models/Classe")
const Login = require("../Models/Login")
const { isEmpty} = require("../Utils/Functions")

module.exports = {
    Agent : function(req, res){
        

            const { fonction, username, password } = req.body

            if(isEmpty(req.body.initialeValue)){
                return res.status(200).json({
                    "message":"Erreur d'enregistrement",
                    "validation": "warning"
                })
            }
            const {  nom, postNom, prenom, sexe } = req.body.initialeValue

            

            if(isEmpty(nom) || isEmpty(fonction) || isEmpty(postNom) || isEmpty(sexe) || isEmpty(username) || isEmpty(password)){
                return res.status(200).json({
                    "message" : "Veuillez remplir les champs",
                    "validation": "warning"
                })
            }
            try {
            let nombre = (parseInt(Math.random() * 1000))
            let code = `ECOLE00${nombre}`

            asyncLib.waterfall([
                
                function(done){
                    Agent.findOne({
                        nom : nom,
                        postNom : postNom,
                    }).then(function(AgentFound){
                        done(null, AgentFound)

                    }).catch(function(error){
                        return res.status(200).json({"message": error})
                    })
                },
                function(AgentFound, done){
                    if(AgentFound){
                        return res.status(200).json({
                            "message":"L'agent existe déjà", "validation": "warning"
                        })
                    }else{
                        Agent.create({
                            nom, postNom, prenom, sexe, 
                            id : code

                        }).then(function(newAgent){
                            if(newAgent){
                                done(null, newAgent)
                            }else{
                                return res.status(500).json({
                                    "id": "Cannot add user"
                                })
                            }
                        }).catch(function(error){
                            return res.status(200).json({
                                "message":"Erreur "+error, "validation": "warning"
                            })
                        })     
                    }
                },
                function(newAgent, done){
                    Login.create({
                        username, password, _id : newAgent._id, fonction
                    }).then(userCreate =>{
                        if(userCreate){
                            done(userCreate)
                        }
                    }).catch(function(error){
                        return res.status(500).json({"message":"Catch :"+error, "validation": "warning"})
                    })
                }

            ], function(newAgent){
                if(newAgent){
                    return res.status(200).json({"message":"Agent enregistrer", "validation": "success"})
                }else{
                    return res.status(500).json({"message":"cannot add user", "validation": "warning"})
                }

            })
            
        } catch (error) {
            return res.status(500).json({"message":"EndCatch :"+error, "validation": "warning"})
        }
    },
    upDateAgent : async(req, res)=>{
        const { nom, postNom, prenom, username, _id } = req.body
        if(isEmpty(_id)){
            return res.status(200).json({
                "message":"Veuillez remplir les champs",
                "error":true
            })
        }
        asyncLib.waterfall([
            function(done){
                Agent.findOneAndUpdate({
                    _id
                }, {
                    $set : { nom, postNom, prenom }
                    
                }, null, (error, result)=>{
                    if(error)throw error
                    if(result){done(null, result)}
                })
            },
            function(result, done){
                if(!isEmpty(username)){
                    Login.findOneAndUpdate({
                        _id : result._id
                    }, { $set : { username }}, null, (err, response)=>{
                        if(err)throw err
                    })
                }
            
                done(result)
                
            }
        ], function(response){
            if(response){
                return res.status(200).json({
                    "message":"Modification effectuer",
                    "error":false
                })
            }
            if(!response){
                return res.status(200).json({
                    "message":"Erreur de modification",
                    "error":true
                })
            }
        })
    },
    Login: (req, res)=>{
        try {
            const { username, password } = req.body
            
            if(isEmpty(username) || isEmpty(password)){
                return res.status(200).json({'message':"Veuillez remplir les champs", "error":"warning"})
            }
            Login.findOne({
                username
            }).then(function(userFound){
                if(userFound){

                    modelClasse.findOne({
                        titulaire : user
                    }).then((ClasseFound)=>{

                        bcrypt.compare(password, userFound.motDePasse, function(errBcrypt, resBcrypt){
                            if(resBcrypt){
                                return res.status(200).json({
                                    'token' : jwtUtils.generateTokenForUser(userFound),
                                    "classe" : ClasseFound ? ClasseFound.title : false
                                })
                            }else{
                                return res.status(200).json({
                                    "message":"invalid password",
                                    "error":"warning",
                                })
                            }
                        })
                    })
                    
                }else{
                    return res.status(200).json({'message':'user not exit in BD', "error":"warning"})
                }
            }).catch(function(err){
                return res.status(200).json({'message':'unable to verify user', "error":"warning"})
            })
        } catch (error) {
            return res.status(200).json({'message':'EndCatch'+error, "error":"warning"})   
        }
    },
    retournUserId : (req, res)=>{
        const { token } = req.params
        var userId = jwtUtils.getUserId(token)
        return res.status(200).json(userId)
    },
    PermissionAgent : (req, res)=>{
        const { value, _id } = req.body
   
        Agent.findOneAndUpdate({
            _id : _id
        }, { $set : { permission : value }}, null, (err, response)=>{
            if(err)throw err
            if(response){
                return res.status(200).json({
                    "message":"Opération effectuer",
                    "error":"success"
                })
            }
        })
    }
}