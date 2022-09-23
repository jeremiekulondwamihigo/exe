const CotationModel = require("../Models/Cotation")
const ModelCours = require("../Models/Cours")
const ModelInscrit = require("../Models/EleveInscrits")
const asyncLib = require("async")
const { isEmpty } = require("../Utils/Functions")
const ModelPeriode = require("../Models/Periode")

module.exports = {

    Cotation : (req, res)=>{
        

        try {
            if(req.body.initialeValue === undefined){
                return res.status(200).json({
                    "message":"Veuillez remplir au moins un champs",
                    "error":"warning"
                })
            }
            const { cours, premiere, deuxieme, examenOne, troisieme, quatrieme, examenTwo } = req.body.initialeValue
            const { codeEleve } = req.body
            const premiereP = parseInt(premiere)
            const deuxiemeP = parseInt(deuxieme)
            const examentP1 = parseInt(examenOne)
            const troisiemeP = parseInt(troisieme)
            const quatriemeP = parseInt(quatrieme)
            const examenP2 = parseInt(examenTwo)
            
            
            if(codeEleve === undefined || cours === undefined){
                return res.status(200).json({
                    "message":"Veuillez remplir au moins un champs",
                    "error":"warning"
                })
            }

            asyncLib.waterfall([
                function(done){
                    ModelCours.findOne({_id : cours}).then(coursFound =>{
                        done(null, coursFound)
                    })
                }, 
                
                function(coursFound, done){
                    if(premiereP > coursFound.maxima || deuxiemeP > coursFound.maxima 
                        || (examentP1 > coursFound.maxima * 2) || troisiemeP > coursFound.maxima || 
                        quatriemeP > coursFound.maxima || (examenP2 > coursFound.maxima * 2)){
                            return res.status(200).json({
                                "message":"cote superieur",
                                "error":"warning"
                            })
                    }
                    
                    ModelInscrit.findOne({
                        codeEleve : codeEleve,
                        active : true,
                    }).then(EleveFound =>{
                        if(EleveFound){
                            done(null, EleveFound, coursFound)
                        }
                    })
                    
                    
                },
                function(EleveFound, coursFound, done){
                    CotationModel.findOne({
                        codeEleve : codeEleve,
                        idCours : coursFound.idCours
                    }).then(response =>{

                        if(response != null){
                            //Modification selon la période du body
                            CotationModel.findOneAndUpdate({
                                codeEleve : codeEleve,
                                idCours : coursFound.idCours
                            }, {
                                $set:{ 
                                    premierePeriode : !isNaN(premiereP) ? premiere : response.premierePeriode,
                                    deuxiemePeriode : !isNaN(deuxiemeP)  ? deuxieme : response.deuxiemePeriode, 
                                    examenOne : !isNaN(examentP1)  ? examenOne : response.examenOne, 
                                    troisiemePeriode: !isNaN(troisiemeP)  ? troisieme : response.troisiemePeriode,
                                    quatriemePeriode: !isNaN(quatriemeP)  ? quatrieme : response.quatriemePeriode, 
                                    examenTwo: !isNaN(examenP2) ? examenTwo : response.examenTwo,
                                }
                            }, null, (error, result)=>{
                                    if(error)throw error 
                                    done(result) 
                            })
                            
                    } else{
                        CotationModel.find({}).then((CotationTrouver)=>{
                            CotationModel.create({
                                id : CotationTrouver.length, 
                                idCours : coursFound.idCours, 
                                codeEleve : EleveFound.codeEleve, 
                                premierePeriode : !isNaN(premiereP) ? premiere : 0,
                                deuxiemePeriode : !isNaN(deuxiemeP)  ? deuxieme : 0, 
                                examenOne : !isNaN(examentP1)  ? examenOne : 0, 
                                troisiemePeriode: !isNaN(troisiemeP)  ? troisieme : 0,
                                quatriemePeriode: !isNaN(quatriemeP)  ? quatrieme : 0, 
                                examenTwo: !isNaN(examenP2) ? examenTwo : 0,
                                classe : EleveFound.classe
                            }).then((result)=>{
                                done(result)
                            })
                        }) 
                    }

                    })
                }
            ], function(result){
                if(result){
                    return res.status(200).json({
                        "message": ""+result.codeEleve,
                        "error":"success"
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":"warning"
                    })
                }
            })
           
        } catch (error) {
            console.log({erreurEnd : error})
        }
    },
    multipleCote : (req, res)=>{

        if(req.body.initialeValueCoteMultiple === undefined){
            return res.status(200).json({
                "message":"Point introuvable",
                "error":"warning"
            })
        }
        const { classe, cours } = req.body

        const { premiere, deuxieme, examenOne, troisieme, quatrieme, examenTwo } = req.body.initialeValueCoteMultiple

        asyncLib.waterfall([
                           
            function(done){
                ModelInscrit.find({ 
                    active : true, 
                    classe : classe
                }).then((EleveFound)=>{
                    
                    if(EleveFound){
                        done(null, EleveFound)
                    }else{

                    }
                })
            },
            function(EleveFound, done){
                for(let i=0; i < EleveFound.length; i++){
                    CotationModel.findOne({
                        codeEleve : EleveFound[i].codeEleve,
                        idCours : cours
                    }).then(response=>{
                        if(response !== null){
                            //Modification selon la période du body
                            CotationModel.findOneAndUpdate({
                                codeEleve : EleveFound[i].codeEleve,
                                idCours : cours
                            }, {
                                $set:{ 
                                    premierePeriode : !isNaN(premiere) ? premiere : response.premierePeriode,
                                    deuxiemePeriode : !isNaN(deuxieme)  ? deuxieme : response.deuxiemePeriode, 
                                    examenOne : !isNaN(examenOne)  ? examenOne : response.examenOne, 
                                    troisiemePeriode: !isNaN(troisieme)  ? troisieme : response.troisiemePeriode,
                                    quatriemePeriode: !isNaN(quatrieme)  ? quatrieme : response.quatriemePeriode, 
                                    examenTwo: !isNaN(examenTwo) ? examenTwo : response.examenTwo,
                                }
                            }, null, (error, result)=>{
                                    if(error)throw error  
                                    if((i + 1) === EleveFound.length){
                                        done(result)
                                    }
                            })
                            
                    } else{
                        CotationModel.find({}).then((CotationTrouver)=>{
                            CotationModel.create({
                                id : CotationTrouver.length, 
                                idCours : cours, 
                                codeEleve : EleveFound[i].codeEleve, 
                                premierePeriode : !isNaN(premiere) ? premiere : 0,
                                deuxiemePeriode : !isNaN(deuxieme)  ? deuxieme : 0, 
                                examenOne : !isNaN(examenOne)  ? examenOne : 0, 
                                troisiemePeriode: !isNaN(troisieme)  ? troisieme : 0,
                                quatriemePeriode: !isNaN(quatrieme)  ? quatrieme : 0, 
                                examenTwo: !isNaN(examenTwo) ? examenTwo : 0,
                                classe : EleveFound[i].classe
                            }).then((results)=>{
                                if((i + 1) === EleveFound.length){
                                    done(results)
                                }
                            })
                        }) 
                    }
                    })
                    
                }
            }
        ], function(result){
            if(result){
                return res.status(200).json({
                    "message":"Enregistrement effectuer",
                    "error":"success"
                })
            }else{
                return res.status(200).json({
                    "message":"Erreur d'enregistrement",
                    "error":"warning"
                })
            }
        })  
    },
    changeCote : (req, res)=>{
        const { valeur } = req.body
        CotationModel.findOneAndUpdate({
            examenTwo : null
        }, {
            $set:{
                examenTwo : valeur
            }
        }, null, (error, result)=>{
            res.send(result)
            if(error){ console.log(error)}  
        })
    },
    
    CotationOther : (req, res)=>{
        

        try {

            const { periode, cours, codeEleve, cote, id } = req.body
            const point = parseInt(cote)

            if(isEmpty(periode) || isEmpty(cours) || isEmpty(id) || isEmpty(codeEleve) || isEmpty(cote) || typeof(point) !== "number"){
                return res.status(200).json({
                    "message":"Erreur", "error":true
                })
            }
            
            asyncLib.waterfall([
                function(done){
                    ModelCours.findOne({_id : cours}).then(coursFound =>{
                        done(null, coursFound)
                    }).catch(function(error){
                        return res.status(200).json({
                            "message":"Erreur : "+error, "error":true
                        })
                    })
                }, 
                function(coursFound, done){
                    if((periode === "premierePeriode" || periode === "deuxiemePeriode" || periode === "troisiemePeriode" ||
                    periode === "quatriemePeriode"
                    ) && (point > coursFound.maxima || point <= 0) ){
                        return res.status(200).json({
                            "message":"Cote non autoriser",
                            "error":true
                        })
                    }
                    if((periode === "examenOne" || periode === "examenTwo") && (point > coursFound.maxima * 2 || point <= 0)){
                        return res.status(200).json({
                            "message":"Cote non autoriser",
                            "error":true
                        })
                    }
                    
                    ModelInscrit.findOne({
                        codeEleve : codeEleve,
                        active : true,
                    }).then(EleveFound =>{
                        if(EleveFound){
                            done(null, EleveFound, coursFound)
                        }
                    }).catch(function(error){
                        return res.status(200).json({
                            "message":"Erreur : "+error, "error":true
                        })
                    })
                    
                    
                },
                function(EleveFound, coursFound, done){
                    CotationModel.findOne({
                        codeEleve : codeEleve,
                        idCours : coursFound.idCours
                    }).then(response =>{

                        if(response != null){
                            //Modification selon la période du body
                            CotationModel.findOneAndUpdate({
                                codeEleve : codeEleve,
                                idCours : coursFound.idCours
                            }, {
                                $set:{ 
                                 [periode] : point 
                                }
                            }, null, (error, result)=>{
                                    if(error)throw error 
                                    done(result) 
                            })
                            
                    } else{
                        CotationModel.create({
                            id : id, 
                            idCours : coursFound.idCours, 
                            codeEleve : EleveFound.codeEleve, 
                            [periode] : point,
                            classe : EleveFound.classe
                        }).then((result)=>{
                            if(result){
                                done(result)
                            }
                            
                        }).catch(function(error){
                            return res.status(200).json({
                                "message":"Erreur : "+error,
                                "error":true
                            })
                        })
                    }
                    })
                }
            ], function(result){
                if(result){
                    return res.status(200).json({
                        "message": ""+ point+ " points",
                        "error":false
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":true
                    })
                }
            })
           
        } catch (error) {
            console.log({erreurEnd : error})
        }
    },
    AfficherEleveCoter : function(req, res){
        const { codeClasse } = req.params
        

           let lookCours = {
            $lookup : {
                from : "cours",
                localField:"idCours",
                foreignField:"idCours",
                as : "cours"
            }
           }
           enseignant = {
            $lookup : {
                from : "agents",
                localField:"cours.enseignant",
                foreignField:"id",
                as :"agents"
            }
           }
 
           let group = { $group : {_id : { branche : "$cours.branche", enseignant : "$agents" },total:{$sum:1}  }}
           asyncLib.waterfall([
            function(done){
                ModelPeriode.findOne({}).then(periodeFound =>{
               
                    let periodeF = ""
                    if(periodeFound){
                        if(periodeFound.periode === "premiere"){ periodeF = "premierePeriode"}  
                        if(periodeFound.periode === "deuxieme"){ periodeF = "deuxiemePeriode"}                   
                        if(periodeFound.periode === "examenPremiere"){ periodeF = "examenOne"}                   
                        if(periodeFound.periode === "troisieme"){ periodeF = "troisiemePeriode"}                   
                        if(periodeFound.periode === "quatrieme"){ periodeF = "quatriemePeriode"}                   
                        if(periodeFound.periode === "examenSecond"){ periodeF = "examenTwo"} 
                        
                        done(null, periodeF)
                    }
                })
            }, function(periodeF, done){
                let match = { $match : { [periodeF]:{ $gte:1, $not:{$lt:1} }, classe : codeClasse, } }
                CotationModel.aggregate([match, lookCours, enseignant,group,   ])
                .then(response => {
                    if(response){
                        done(response)
                    }else{
                        res.status(200).json({
                            "message":"Erreur du server",
                            "error":true
                        })
                    }
                })
            }
           ], function(response){
                return res.send(response)
           })
    },
    AfficherSessionClasse : (req, res)=>{
        const { codeClasse } = req.params

        lookEleve = {
            $lookup : {
                from : "eleves",
                localField:"codeEleve",
                foreignField:"codeEleve",
                as : "eleve"
            }
        }
        lookCours = {
            $lookup : {
                from : "cours",
                localField:"idCours",
                foreignField:"idCours",
                as : "cours"
            }
        }
        addField = {
            $addFields : {
                total : { $add : ["$premierePeriode","$deuxiemePeriode","$examenOne","$troisiemePeriode",
                        "$quatriemePeriode","$examenTwo"
            ]}
            }
        }
        match = { $match : { "classe" : codeClasse }}

        groupe = {$group : { _id : "$codeEleve"}}
        asyncLib.waterfall([
            function(done){
                CotationModel.aggregate([match, groupe]).then(eleveAll =>{
                    if(eleveAll){
                        done(null, eleveAll)
                    }
                }).catch(function(error){console.log(error)})
            }, function(eleveAll, done){
                CotationModel.aggregate([match, lookEleve, lookCours, addField]).then(response =>{
                    if(response){
                        // res.send(response)
                        done(null, response, eleveAll)
                    }
                })
            }, function(response, eleveAll, done){
                let data = []
                for(let i=0; i < eleveAll.length; i++){
                    for(let y=0; y < response.length ; y ++){
                        if(eleveAll[i]._id === response[y].codeEleve){
                            if((response[y].total < response[y].cours[0].maxima * 4) &&
                        response[y].cours[0].validExamen){
                            data.push({
                                "eleve":response[y].eleve[0].nomComplet,
                                "cours": response[y].cours[0].branche,
                                "pointObtenu": response[y].total,
                                "maxima": response[y].cours[0].maxima * 8,
                                "id":eleveAll[i]._id
                            })
                        }
                        if((response[y].total < response[y].cours[0].maxima * 2) &&
                        !response[y].cours[0].validExamen){
                            data.push({
                                "eleve":response[y].eleve[0].nomComplet,
                                "cours": response[y].cours[0].branche,
                                "pointObtenu": response[y].total,
                                "maxima": response[y].cours[0].maxima * 4,
                                "id":eleveAll[i]._id
                            })
                        }

                        }
                        
                        
                    }
                }
                done(null, data, eleveAll)
                
            },
            function(data,eleveAll, done){
                let donner = []
                for(let a=0; a < eleveAll.length; a++){
                    
                    let valeur = data.filter(don =>don.id === eleveAll[a]._id)
                    donner.push({
                        "eleve": valeur[0].eleve,
                        "cours":valeur
                    })
                    
                }
                donner.sort(function(a, b){
                    return a.eleve - b.eleve
                })
                res.send(donner)
            }
        ])
       
        
    }
}
