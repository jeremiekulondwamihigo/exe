const eleveTable = require("../Models/Eleves")
const asyncLib = require("async")
const modelReinscription = require("../Models/EleveInscrits")
const modelPlace = require("../Models/Place")
const { isEmpty } = require("../Utils/Functions")



module.exports = {
    EnregistrementEleve : function(req, res){
        try {
            const {  nomComplet, dateNaiss, lieuNaissance } = req.body.valeur
            const { sexe, id, classe } = req.body
            
            if(isEmpty(nomComplet) || isEmpty(sexe)){
                return res.status(200).json({
                    "message":"Le nom et le sexe sont obligatoires",
                    "error":"warning"
                })
            }

            let anne = new Date().toISOString().split("T")[0].split("-")[0]
            
                asyncLib.waterfall([
                    function(done){
                        eleveTable.find({
                            "nomComplet": nomComplet
                        }).then(function(response){
                            if(response.length > 0){
                                return res.status(200).json({
                                    "message": "L'élève est enregistré " , 
                                    "error" : "warning"
                                })
                            }else{
                                eleveTable.find({}).then(result=>{
                                    let codeCarte = `${result.length + 1}`
                                    let codeEleve = `${codeCarte}-ELEVE${anne}`
                                    
                                    eleveTable.create({
                                        sexe, nomComplet,
                                        dateNaiss, codeEleve, id, lieuNaissance
                                    }).then(function(newEleve){
                                        done(null, newEleve)
                                    }).catch(function(error){
                                        return res.status(200).json({
                                            "message": error,
                                            "error": "warning"
                                        })
                                    })
                                })
                            }
                        }).catch(function(error){
                            return res.status(200).json({"message": "Catch : "+error , "error" : "warning"})
                        }) 
                    }, function(newEleve, done){
                        modelReinscription.create({
                            codeEleve : newEleve.codeEleve, classe,
                             id
                        }).then(function(newEleveInscrit){
                            modelPlace.create({codeEleve : newEleveInscrit.codeEleve,  })
                            done(newEleveInscrit)
                        }).catch(function(error){
                            
                            return res.status(200).json({
                                "message": ""+error,
                                "error": "warning"
    
                            })
                        })

                    }
                ], function(newEleve){
                    if(newEleve){
                        return res.status(200).json({
                            "message":"Elève "+nomComplet+ " enregistré",
                            "error": "success"
                        })
                    }else{
                        return res.status(200).json({
                            "message":"Erreur d'enregistrement",
                            "error": "warning"
                        })
                    }
                })  
            } catch (error) {
                return res.status(200).json({
                    "message":""+error,
                    "error": "warning5"
                })
            }
        },
        
}
