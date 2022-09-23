const modelCours = require("../Models/Cours")
const modelCotation = require("../Models/Cotation")
const modelEleve = require("../Models/EleveInscrits")
const modelAnnee = require("../Models/Annee")
const { readOptions } = require("./Read")

module.exports = {

    Branche : function(req, res){

        try {
            
            const { classe } = req.params
            
            if(classe === ""){
                return res.status(200).json({
                    "message":"Veuillez remplir les champs",
                    "error":"warning"
                })
            }
            varUnwind = { $unwind : "$maxima"}
            varGroup4 = { $group : {"_id" : "$maxima", "total": {$sum : "$maxima"} }};
            varSort2 = { $sort : { "_id" : 1,}}
            varMach = { $match : { classe : classe} }

           
            modelCours.find({
                classe : classe
            }).then((responses)=>{
                modelCours.aggregate(
                    [ varMach, varUnwind, varGroup4, varSort2]).then(response => {
                        if(response){
                            return res.send({
                                branche : response,
                                donner : responses

                            })}
                })  

            })          
        } catch (error) {
            console.log(error)
        }

    },
    Essaie : function(req, res){
        try {
            
            const { codeEleve } = req.params
            varLook = { $lookup: {
                from: 'eleves',
                localField: 'codeEleve',
                foreignField: 'codeEleve',
                as: 'collectionEleve',
              }
            }
            varLookCours = { $lookup: {
                from: 'cours',
                localField: 'idCours',
                foreignField: 'idCours',
                as: 'collectionCours',
              }
            }

            varUnwind1 = { $unwind : "$premierePeriode"}
            varGroup4 = { $group : {"_id" : "$codeEleve", 
            "premiere": {$sum : "$premierePeriode"},
            "deuxieme": {$sum : "$deuxiemePeriode"},
            "examenOne": {$sum : "$examenOne"}, 
            "troisieme": {$sum : "$troisiemePeriode"}, 
            "quatrieme": {$sum : "$quatriemePeriode"}, 
            "examenTwo": {$sum : "$examenTwo"}, 
        }};

            varMach1 = { $match : { classe : "1ere HP"} }
            varMachSession = { $match : { codeEleve : codeEleve, annee : "2020 - 2021"} }
            varUnwindSession = { $unwind : "$premierePeriode"}
            varGroupGroup = { $group : {"_id" : "$idCours", "total": {$sum : "$premierePeriode"} }};

            modelCotation.aggregate(
                [varMachSession, varLookCours, varUnwindSession, ]
            ).then((SessionFound)=>{
                
                modelCotation.aggregate(
                    [varMach1, varUnwind1, varGroup4 ]
                ).then((responseBranche)=>{
                
                modelAnnee.findOne({
                    active : true
                }).then(AnneeFound=>{
                    if(AnneeFound){
                        varMach = { $match : { codeEleve : codeEleve, annee : AnneeFound.annee } }
                        varGroup4 = { $project : {
                            "id":1, "premierePeriode":1, "deuxiemePeriode":1, "examenOne":1, "troisiemePeriode":1,
                            "quatriemePeriode":1,"examenTwo":1, "codeEleve":1,
                            "collectionCours.branche":1,"collectionCours.validExamen":1, "collectionEleve.nomComplet":1, "collectionEleve.dateNaiss":1,
                            "collectionEleve.sexe":1,"collectionCours.maxima":1
                        } };
                        let coursSessions = []
                        for(let i = 0; i < SessionFound.length; i++){
                            if((SessionFound[i].premierePeriode + SessionFound[i].deuxiemePeriode + SessionFound[i].examenOne + SessionFound[i].troisiemePeriode
                                + SessionFound[i].quatriemePeriode + SessionFound[i].examenTwo) < (SessionFound[i].collectionCours[0].maxima * 4)){
                                    coursSessions.push(SessionFound[i].collectionCours[0].branche)
                                }
                        }
                        modelCotation.aggregate([
                             varMach, varLookCours, varLook, varGroup4 
                             ]).then(response=>{res.send({
                                 data: response,
                                 totaux : responseBranche,
                                 session : coursSessions
                             })})
                        
                            }
                })
            })
            })  
        } catch (error) {
            console.log(error)
        }
    },
    Check : (req, res)=>{
        modelEleve.find({ classe :"1ere HP"}, {"codeEleve" : 1}).then((dataBoucle)=>{

            
            varLook = { $lookup: {
                from: 'eleves',
                localField: 'codeEleve',
                foreignField: 'codeEleve',
                as: 'collectionEleve',
              }
            }
            varLookCours = { $lookup: {
                from: 'cours',
                localField: 'idCours',
                foreignField: 'idCours',
                as: 'collectionCours',
              }
            }

            varUnwind1 = { $unwind : "$premierePeriode"}
            varGroup4 = { $group : {"_id" : "$codeEleve", 
            "premiere": {$sum : "$premierePeriode"},
            "deuxieme": {$sum : "$deuxiemePeriode"},
            "examenOne": {$sum : "$examenOne"}, 
            "troisieme": {$sum : "$troisiemePeriode"}, 
            "quatrieme": {$sum : "$quatriemePeriode"}, 
            "examenTwo": {$sum : "$examenTwo"}, 
        }};

            varMach1 = { $match : { classe : "1ere HP"} }
           
            varUnwindSession = { $unwind : "$premierePeriode"}
            varGroupGroup = { $group : {"_id" : "$idCours", "total": {$sum : "$premierePeriode"} }};
            let sessionTable = []
            for(let a =0; a < dataBoucle.length; a++){

                varMachSession = { $match : { codeEleve : dataBoucle[a].codeEleve, annee : "2020 - 2021"} }
            modelCotation.aggregate(
                [varMachSession, varLookCours, varUnwindSession, ]
            ).then((SessionFound)=>{
                sessionTable.push(SessionFound)
                
                modelCotation.aggregate(
                    [varMach1, varUnwind1, varGroup4 ]
                ).then((responseBranche)=>{
                modelAnnee.findOne({
                    active : true
                }).then(AnneeFound=>{
                    if(AnneeFound){
                        varMach = { $match : { codeEleve : dataBoucle[a].codeEleve, annee : AnneeFound.annee } }
                        varGroup4 = { $project : {
                            "id":1, "premierePeriode":1, "deuxiemePeriode":1, "examenOne":1, "troisiemePeriode":1,
                            "quatriemePeriode":1,"examenTwo":1, "codeEleve":1,
                            "collectionCours.branche":1,"collectionCours.validExamen":1, "collectionEleve.nomComplet":1, "collectionEleve.dateNaiss":1,
                            "collectionEleve.sexe":1,"collectionCours.maxima":1
                        } };
                        let coursSessions = []
                        for(let i = 0; i < SessionFound.length; i++){
                            if(SessionFound[0].codeEleve === dataBoucle[a].codeEleve){
                                if((SessionFound[i].premierePeriode + SessionFound[i].deuxiemePeriode + SessionFound[i].examenOne + SessionFound[i].troisiemePeriode
                                    + SessionFound[i].quatriemePeriode + SessionFound[i].examenTwo) < (SessionFound[i].collectionCours[0].maxima * 4)){
                                        coursSessions.push(SessionFound[i].collectionCours[0].branche)
                                }

                            }
                        }
                        let donner = []
                        modelCotation.aggregate([
                             varMach, varLookCours, varLook, varGroup4 
                             ]).then(response=>{
                                res.send({data : response, branche : responseBranche})
                                
                        })
                        }
                })
            })
            
            })  
            }
            
            
            
        })
    }
}