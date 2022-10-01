const modelCours = require("../Models/Cours")
const modelCotation = require("../Models/Cotation")
const modelPlace = require("../Models/Place")
const modelPeriode = require("../Models/Periode")
const { isEmpty } = require("../Utils/Functions")
const asyncLab = require("async")
const ModelEleve = require("../Models/EleveInscrits")
const { response } = require("express")

module.exports = {

    Branche : function(req, res){

        try {
            
            const { classe } = req.params
            
            if(isEmpty(classe)){
                return res.status(200).json({
                    "message":"Veuillez remplir les champs",
                    "error":"warning"
                })
            }
            varUnwind = { $unwind : "$maxima"}
            varGroup4 = { $group : {"_id" : "$maxima", "total": {$sum : "$maxima"} }};
            
            varMach = { $match : { classe : classe} }

            varSort = {$sort : {_id : 1}}

            asyncLab.waterfall([
                function(done){
                    modelCours.aggregate([varMach, varUnwind, varGroup4, varSort]).then(response => {
                        
                        
                        done(null, response)
                }).catch(function(error){console.log(error)})
                    
                }, function(response, done){
                    
                    modelCours.find({
                        classe : classe
                    }).then((responses)=>{
                        done(null, responses, response)
                    }).catch(function(error){console.log(error)})
                },
                function(responses, response, done){
                    
                    modelCours.find({ classe : classe, validExamen : false}).then(CoursExamenFound =>{
                        
                        done(CoursExamenFound, responses, response)
                    }).catch(function(error){console.log(error)})
                }
            ], function(CoursExamenFound, responses, response){
                
                let valeur = CoursExamenFound.length <= 0 ? 0 : (CoursExamenFound[0].maxima)
                        
                        if(response && CoursExamenFound.length > 0){
                            return res.send({
                                branche : response,
                                donner : responses,
                                coursFalseExamen : valeur
                            })
                        }else{
                            return res.send({
                                branche : response,
                                donner : responses,
                                coursFalseExamen : 0
                            })
                        }
            })

                     
        } catch (error) {
            console.log(error)
        }

    },
    CotationEleve : function(req, res){
        try {
            
            
            const { codeEleve } = req.params
            
                varLook = { $lookup: {
                    from: 'eleves',
                    localField: 'codeEleve',
                    foreignField: 'codeEleve',
                    as: 'collectionEleve',
                    }
                }
                varLookPlace = { $lookup: {
                    from: 'places',
                    localField: 'codeEleve',
                    foreignField: 'codeEleve',
                    as: 'elevePlace',
                    }
                }
                varLookCours = { $lookup: {
                    from: 'cours',
                    localField: 'idCours',
                    foreignField: 'idCours',
                    as: 'collectionCours',
                  }
                }
        
                        varGroup5 = { $group : {"_id" : "$codeEleve", 
                        "premiere": {$sum : "$premierePeriode"},
                        "deuxieme": {$sum : "$deuxiemePeriode"},
                        "examenOne": {$sum : "$examenOne"}, 
                        "troisieme": {$sum : "$troisiemePeriode"}, 
                        "quatrieme": {$sum : "$quatriemePeriode"}, 
                        "examenTwo": {$sum : "$examenTwo"}, }};

                        varGroup4 = { $project : {
                            "id":1, "premierePeriode":1, 
                            "deuxiemePeriode":1, 
                            "examenOne":1, "troisiemePeriode":1,
                            "quatriemePeriode":1,"examenTwo":1, 
                            "codeEleve":1,
                            "collectionCours.branche":1,
                            "collectionCours.validExamen":1,
                            "collectionEleve.nomComplet":1, 
                            "collectionEleve.dateNaiss":1,
                            "collectionEleve.sexe":1,
                            "collectionEleve.lieuNaissance":1
                        } };
            
                        varUnwindSession = { $unwind : "$premierePeriode"}
                        varGroupGroup = { $group : {"_id" : "$idCours", "total": {$sum : "$premierePeriode"} }};
                          
                                let varMach1 = { $match : { codeEleve : codeEleve } }

                                modelCotation.aggregate(
                                    [varMach1, varGroup5, varLookPlace ]
                                ).then((responseBranche)=>{
                                        modelCotation.aggregate([
                                             varMach1, varLookCours, varLook, varGroup4
                                             ]).then(function(response){

                                                modelPlace.findOne({ codeEleve : codeEleve }).then((placeFound)=>{
                                                    if(response.length > 0){
                                                        modelPeriode.find({}).then((PeriodeFound)=>{
                                                            if(PeriodeFound[0].periode == "premiere"){
                                                                res.send({
                                                                    data : response, branche : responseBranche,
                                                                    value : responseBranche[0].premiere, place : placeFound
                                                               })
                                                            }
                                                            if(PeriodeFound[0].periode == "deuxieme"){
                                                                res.send({
                                                                    data : response, branche : responseBranche,
                                                                    value : responseBranche[0].deuxieme, place : placeFound
                                                               })
                                                            }
                                                            if(PeriodeFound[0].periode == "examenPremiere"){
                                                                res.send({
                                                                    data : response, branche : responseBranche,
                                                                    value : responseBranche[0].examenOne, place : placeFound
                                                               })
                                                            }
                                                            if(PeriodeFound[0].periode == "troisieme"){
                                                                res.send({
                                                                    data : response, branche : responseBranche,
                                                                    value : responseBranche[0].troisieme, place : placeFound
                                                               })
                                                            }
                                                            if(PeriodeFound[0].periode == "quatrieme"){
                                                                res.send({
                                                                    data : response, branche : responseBranche,
                                                                    value : responseBranche[0].quatrieme, place : placeFound
                                                               })
                                                            }
                                                            if(PeriodeFound[0].periode == "examenSecond"){
                                                                res.send({
                                                                    data : response, branche : responseBranche,
                                                                    value : responseBranche[0].examenTwo, place : placeFound
                                                               })
                                                            }
                                                            
                                                        })
                                                        
                                                    }else{
                                                        res.send(null)
                                                    }
                                                })

                                                 
                                                
                                            })
                                            
                            })
                            
        } catch (error) {
            console.log(error)
        }
    },
    ResultatClasse : (req, res)=>{
        const { codeClasse } = req.params

        match = { $match : {"classe" : codeClasse, "active":true}}
periode = "premiereP"
sort={ $sort : { [periode] : -1}}

lookCotation = { $lookup : {
    from : "cotations",
    localField : "codeEleve",
    foreignField:"codeEleve",
    as : "cotation"
}}
lookEleve = {
    $lookup : {
        from :"eleves",
        localField:"codeEleve",
        foreignField:"codeEleve",
        as : "eleve"
    }
}

lookCours = { $lookup : {
    from : "cours",
    localField : "cotation.idCours",
    foreignField:"idCours",
    as : "cours"
}}

addField = {
    $addFields:{ 
        premiereP : {$sum :"$cotation.premierePeriode"}, 
        deuxiemeP : {$sum : "$cotation.deuxiemePeriode"},
        examenOne : {$sum : "$cotation.examenOne"},
        troisiemeP : {$sum : "$cotation.troisiemePeriode"},
        quatriemeP : {$sum : "$cotation.quatriemePeriode"},
        examenTwo : {$sum : "$cotation.examenTwo"},
        },
  }

ModelEleve.aggregate([match, lookCotation, addField, lookEleve, sort ]).then(response =>{
    res.send(response)
})
    },



    BulletinSeptieme : (req, res)=>{
        const { codeEleve } = req.params


            let lookCours = {
                $lookup : {
                    from :"cours",
                    localField:"idCours",
                    foreignField:"idCours",
                    as : "cours"
                }
            }
            let lookEleve = {
                $lookup :{
                    from :"eleves",
                    localField:"codeEleve",
                    foreignField:"codeEleve",
                    as : "eleve"
                }
            }
            
            let addFieldTotal = {
                $addFields : {
                    tot1 : {
                        $add : ["$premierePeriode", "$deuxiemePeriode", "$examenOne"]
                    },
                    tot2 : {
                        $add : ["$troisiemePeriode", "$quatriemePeriode", "$examenTwo"]
                    },
                    totGen : {
                        $add : [
                            "$premierePeriode", "$deuxiemePeriode", "$examenOne", 
                            "$troisiemePeriode", "$quatriemePeriode", "$examenTwo"
                        ]
                    }
                }
            }
            lookPlace = {
                $lookup : {
                    from : "places",
                    localField: "codeEleve",
                    foreignField : "codeEleve",
                    as : "place"
                }
            }
                
            let match = { $match : { codeEleve : codeEleve  } }

            asyncLab.waterfall([
                function(done){
                    modelCotation.aggregate([ match, lookCours, addFieldTotal, lookEleve, lookPlace ]).then( response =>{
                       
                        let tableau = {}
                                            
                        for(let i=0; i< response.length; i++){
                            tableau.premiere = (tableau.premiere ? tableau.premiere : 0) + response[i].premierePeriode
                            tableau.deuxieme = (tableau.deuxieme ? tableau.deuxieme : 0) + response[i].deuxiemePeriode
                            tableau.examenOne = (tableau.examenOne ? tableau.examenOne : 0) + response[i].examenOne
                            tableau.totalOne = tableau.premiere + tableau.deuxieme + tableau.examenOne
                            tableau.troisieme = (tableau.troisieme ? tableau.troisieme : 0) + response[i].troisiemePeriode
                            tableau.quatrieme = (tableau.quatrieme ? tableau.quatrieme : 0) + response[i].quatriemePeriode
                            tableau.examenTwo = (tableau.examenTwo ? tableau.examenTwo : 0) + response[i].examenTwo
                            tableau.totalTwo = tableau.totalOne + tableau.troisieme + tableau.quatrieme + tableau.examenTwo
                            tableau.totalGen = tableau.totalTwo + tableau.totalOne
                        }
                        done(response, tableau)
                             
                    })
                },
                
            ], function(response, tableau){
                return res.status(200).json({
                    response, tableau
                })
                
            })
            
    

    }
}