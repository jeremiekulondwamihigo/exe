const ModelAnnee = require("../Models/Annee")
const ModelClasse = require("../Models/Classe")
const { isEmpty } = require("../Utils/Functions")
const asyncLib = require("async")

module.exports = {
    Annee : function(req, res){
        const { annee } = req.body
            if(annee == undefined){
                return res.status(200).json({
                    "message" : "Veuillez remplir les champs",
                    "error" : "warning"
                })
            }
            try {
            ModelAnnee.findOne({
                annee : annee
            }).then(AnneeFound=>{
                if(AnneeFound){
                    return res.status(200).json({
                        "message" : "L'annee existe ",
                        "error" : "warning"
                    })
                }else{
                    ModelAnnee.create({annee}).then(anneeCreate=>{
                        if(anneeCreate){
                            return res.status(200).json({
                                "message" : "Enregistrement effectuer",
                                "error" : "success"
                            })
                        }else{
                            return res.status(200).json({
                                "message" : "Erreur d'enregistrement",
                                "error" : "warning"
                            })
                        }
                    })
                }
            })
        } catch (error) {
            console.log("y a une erreur")
        }
    },
    Classe : function(req, res){
        const { classe, title, } = req.body.initialeValue
        const { titulaire, id } = req.body;

         let codeClasse = (parseInt(Math.random() * 100000));
   
            if(isEmpty(classe) || isEmpty(title) || isEmpty(id)){
                return res.status(200).json({
                    "message" : "Veuillez remplir les champs",
                    "error" : "warning"
                })
            }
            asyncLib.waterfall([
                function(done){
                    ModelClasse.findOne({
                        titulaire
                    }).then( titulaireFound =>{
                        if(titulaireFound){
                            return res.status(200).json({
                                "message" : "L'enseignant est affecté ailleurs",
                                "error" : "warning"
                            })
                        } done(null, titulaireFound)
                    })
                },
                function(titulaireFound, done){
                    ModelClasse.findOne({
                        title : title,
                        classe : classe
                }).then(ClasseFound=>{
                    if(ClasseFound){
                        return res.status(200).json({
                            "message" : "La classe existe",
                            "error" : "warning"
                        })
                    }
                    done(null, ClasseFound)
                    
                }).catch(function(err){
                    console.log(err)
                })
                }, function(ClasseFound, done){
                    if(!ClasseFound){
                        ModelClasse.create({
                            classe, title, id, titulaire, codeClasse
                        }).then(ClasseCreate=>{
                            done(ClasseCreate)
                        }).catch(function(error){
                            console.log(error)
                        })
                    }
                }
            ], function(ClasseCreate){
                if(ClasseCreate){
                    return res.status(200).json({
                        "message" : "classe enregistrer",
                        "error" : "success"
                })
                }else{
                    return res.status(200).json({
                        "message" : "Erreur d'enregistrement",
                        "error" : "warning"
                    })
                }
            })
            try {
                
        } catch (error) {
            console.log(error)
        }
    },
    TitulaireClasse : async(req, res)=>{
        const { _id, codeAgent } = req.body
        
        asyncLib.waterfall([
            function(done){
                ModelClasse.findOne({
                    titulaire : codeAgent
                }).then(response =>{
                    if(response){
                        return res.status(200).json({
                            "message":"L'enseignant est affecté ailleurs",
                            "error":true
                        })
                    }
                    done(null, response)
                })
            }, function(response, done){
                ModelClasse.findOneAndUpdate({
                    _id
                }, { $set : {
                    titulaire : codeAgent
                }}, null, (error, result)=>{
                    if(error) throw error
                    if(result){
                        done(result)
                    }
                })
            }
        ], function(result){
            if(result){
                return res.status(200).json({
                    "message":"Attribution effectuée",
                    "error":false
                })
            }else{
                return res.status(200).json({
                    "message":"Erreur d'affectation",
                    "error":true
                })
            }
        })
        
    }
}