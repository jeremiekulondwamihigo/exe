const modelClasse = require("../Models/Classe")
const modelAnnee = require("../Models/Annee")
const modelEleve = require("../Models/EleveInscrits")
const modelOption = require("../Models/Small")
const modelAgent = require("../Models/Agent")
const modelCour = require("../Models/Cours")
const modelPeriode = require("../Models/Periode")
const modelEleveInitiale = require("../Models/Eleves")
const modelCotation = require("../Models/Cotation")


module.exports = {
    readClasse : (req, res)=>{
        let varLookAgent = { $lookup: {
            from: 'agents',
            localField: 'titulaire',
            foreignField: 'id',
            as: 'titulaire',
          }
        }
        modelClasse.aggregate([varLookAgent]).then(response =>{
            return res.send(response.reverse())
        }).catch(function(error){console.log(error)})

        
    },
    readTableStudentInitiale : (req, res)=>{
        //const { codeClasse } = req.params
     
        modelEleveInitiale.find({
        }).then((elevesFound)=>{
        
            if(elevesFound){return res.send(elevesFound)}
        }).catch(function(error){console.log(error)})
    },
    CoursParMax : (req, res)=>{
        const { max, value } = req.params
        modelCour.find({
            classe : value,
            maxima : max
        }).then((CoursFound)=>{
            if(CoursFound){ res.send(CoursFound)}
        }).catch(function(error){console.log(error)})
    },
    readPeriode : (req, res)=>{
        modelPeriode.find({
        }).then((PeriodeFound)=>{
            if(PeriodeFound){return res.send(PeriodeFound)}
        }).catch(function(error){console.log(error)})
    },
    
    readCours : (req, res)=>{
        const { classe } = req.params
        
        modelPeriode.findOne({}).then((PeriodeFound)=>{
            if(PeriodeFound){
                if(PeriodeFound.periode == "examenPremiere" || PeriodeFound.periode == "examenSecond"){
                    modelCour.find({
                        classe : classe,
                        validExamen : true
                    }).then((CoursFound)=>{
                        if(CoursFound){
                            
                            return res.send(CoursFound.reverse())
                        }
                    }).catch(function(error){console.log(error)})
                }else{
                    modelCour.find({
                        classe : classe,
                    }).then((CoursFound)=>{
                        if(CoursFound){
                            return res.send(CoursFound.reverse())
                        }
                    }).catch(function(error){console.log(error)})
                }
            }
            
        }).catch(function(error){console.log(error)})
       
    },
    readAgent : (req, res)=>{

        modelAgent.find({
        }).then((AgentFound)=>{
            if(AgentFound){return res.send(AgentFound.reverse())}
        }).catch(function(error){console.log(error)})
    },
    readOptions : (req, res)=>{
        modelOption.find({})
        .then((OptionFound)=>{
            if(OptionFound){return res.send(OptionFound)}
        }).catch(function(error){console.log(error)})
    },
    readAnnee : (req, res)=>{
        modelAnnee.find({
        }).then((AnneeFound)=>{
            if(AnneeFound){return res.send(AnneeFound.reverse())}
        }).catch(function(error){console.log(error)})
    
},
    readAnneeActive : (req, res)=>{
        modelAnnee.find({
            active : true
        }).then((AnneeFound)=>{
            if(AnneeFound){return res.send(AnneeFound.reverse())}
        }).catch(function(error){console.log(error)})
    
},
    readEleves : (req, res)=>{
      
           try {
               

                varLookCours = { $lookup: {
                    from: 'eleves',
                    localField: 'codeEleve',
                    foreignField: 'codeEleve',
                    as: 'collectionEleve',
                  }
                }
                
                modelEleve.aggregate([
                    varLookCours 
                    ]).then(response=>{
                        res.send(response.reverse())
                    }).catch(function(error){console.log(error)})
               
           } catch (error) {
               console.log(error)
           }
        
    },

    readEleveByClasse : (req, res)=>{
        const { classe } = req.params
      
                varLookCours = { $lookup: {
                    from: 'eleves',
                    localField: 'codeEleve',
                    foreignField: 'codeEleve',
                    as: 'collectionEleve',
                  }
                }
                
                varMach = { $match : { classe : classe, active : true } }
                varSort = { $sort : {"collectionEleve.nomComplet":1} };
                
                modelEleve.aggregate([
                    varMach, varLookCours, varSort
                    ]).then(response=>{
                        res.send(response)
                    })
            
        
        
    },
    readAgentById : (req, res)=>{
        const { codeAgent } = req.params

        let lookClasse = {
            $lookup : {
                from : "classes",
                localField : "id",
                foreignField : "titulaire",
                as : "classe"
            }
        }
        let match = { $match : { id : codeAgent, permission : true }}

        modelAgent.aggregate([match, lookClasse ]).then(response =>{
            res.send(response)
        }).catch(function(error){console.log(error)})
        
    },
    readCoursParEnseignant : (req, res)=>{
        const { idEnseignant } = req.params

        let readClasse = {
            $lookup : {
                from : "classes",
                localField : "classe",
                foreignField:"codeClasse",
                as : "classe"
            }
        }
        let matchone = { $match : { enseignant : idEnseignant, validExamen : true }}
        let match = { $match : { enseignant : idEnseignant }}

        modelPeriode.find({}).then(PeriodeFound=>{
            if(PeriodeFound.periode == "examenPremiere" || PeriodeFound.periode == "examenSecond"){
                modelCour.aggregate([matchone, readClasse])
                .then((CoursFound)=>{
                    if(CoursFound){return res.send(CoursFound)}
                }).catch(function(error){console.log(error)})
            }else{
                modelCour.aggregate([ match, readClasse])
                .then((CoursFound)=>{
                    if(CoursFound){return res.send(CoursFound)}
                }).catch(function(error){console.log(error)})
            } 
        })
         
    },
    readEleveEnOrdre : (req, res)=>{
        const { classe, somme } = req.params
        
                varLookCours = { $lookup: {
                    from: 'eleves',
                    localField: 'codeEleve',
                    foreignField: 'codeEleve',
                    as: 'collectionEleve',
                  }
                }
                varLookCours2 = { $lookup: {
                    from: 'eleveinscrits',
                    localField: 'codeEleve',
                    foreignField: 'codeEleve',
                    as: 'eleveInscrit',
                  }
                }
                varGroup4 = { $project : {
                    "id":1, "sommePayer":1, "annee":1, "collectionEleve.nomComplet":1,
                    "eleveInscrit.classe":1, "collectionEleve.sexe":1,

                } };
                varMach = { $match : { classe : classe } }
                varMach2 = { $match : {"sommePayer": { $gte : parseInt(somme)} }}
                
                modelSommeDejaPayer.aggregate([
                    varMach2, varMach, varLookCours, varLookCours2, varGroup4
                    ]).then(response=>{res.send(response)}).catch(function(error){console.log(error)})
            
        
        
    },
    readCotationEleve : (req, res)=>{
        const { idCours, classe } = req.params

        varLookCours = { $lookup: {
            from: 'eleves',
            localField: 'codeEleve',
            foreignField: 'codeEleve',
            as: 'collectionEleve',
          }
        }

            varMach = { $match : { classe : classe, idCours : idCours } }
            varSort = { $sort : {"collectionEleve.nomComplet":1} };

                modelCotation.aggregate([
                    varMach, varLookCours, varSort
                    ]).then(response=>{
                        
                        res.send(response)
                })
            
        
        
    },
    ReadCoursParUnEleve: (req, res)=>{
        const { idCours, codeEleve } = req.params

        if(idCours === undefined || idCours === ""){
            return res.status(200).json({
                message:"Préciser le cours svp",
                error: "true"
            })
        }else{ 
            modelCotation.findOne({
                idCours : idCours,
                codeEleve : codeEleve
            }).then(CoteFound =>{
                if(CoteFound){
                    return res.send(CoteFound)
                }
            }).catch(function(error){console.log(error)})
        }
        
    },   
    ReadCoursInnocuper : (req, res)=>{
        modelCour.find({ enseignant : ''}).then(coursFound=>{
            return res.send(coursFound)
        }).catch(function(error){console.log(error)})
    } 
}