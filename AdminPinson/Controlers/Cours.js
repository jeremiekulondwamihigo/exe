const modelCours = require("../Models/Cours")
const { isEmpty } = require("../Utils/Functions")

module.exports = {

    Cours : (req, res)=>{
        try {
            const { branche, maxima } = req.body.valeur
            const { classe, validExamen, identifiant, } = req.body

            
            if(isEmpty(branche)|| isEmpty(maxima) || isEmpty(classe)){
                return res.status(200).json({
                    "message":"Veuillez remplir les champs",
                    "error":"warning"
                })
            }
            
            modelCours.findOne({
                branche : branche,
                classe : classe
            }).then((BrancheFound)=>{
                if(BrancheFound){
                    return res.status(200).json({
                        "message":"ce cours existe déjà",
                        "error":"warning"
                    })
                }
                if(!BrancheFound){
                    modelCours.find({}).then((coursFound)=>{
                        if(coursFound){
                            modelCours.create({
                                branche, maxima, classe, 
                                id : coursFound.length + 1,
                                idCours : coursFound.length + 2, 
                                validExamen, identifiant
                            }).then((Save)=>{
                                if(Save){
                                    return res.status(200).json({
                                        "message":"Enregistrement effectuer "+branche,
                                        "error":"success"
                                    })
                                }else{
                                    return res.status(200).json({
                                        "message":"Erreur d'enregistrement",
                                        "error":"warning"
                                    })
                                }
                            })
                        }
                    })  
                   
                }
            })
        } catch (error) {
            return res.status(200).json({
                "message":"error : "+error,
                "error":"warning"
            })
        }
    },
    Affectation : (req, res)=>{
        const { idCours, idAgent  } = req.body
        if(isEmpty(idAgent) || isEmpty(idCours)){
            return res.status(200).json({
                "message":"Veuillez remplir les champs",
                "error":"warning"
            })
        }
        modelCours.findOneAndUpdate({
            _id : idCours
        }, {
            $set:{ 
                enseignant : idAgent,
            }
        }, null, (error, result)=>{
                if(error){
                    res.status(200).json({
                        "message":"errer:"+error,
                        "error":"warning"
                    })
                }
                if(result){
                    return res.status(200).json({
                        "message" : "Modification effectuée",
                        "error":"success"
                    })
                }    
        })
    },
    ModifierCours : (req, res)=>{
        const { valeur, validExamen, id } = req.body
        
        const { branche, maxima } = valeur

        modelCours.findOneAndUpdate({
            _id : id
        }, { 
            $set : {
                branche, maxima, validExamen
            }
        }, null, (error, result)=>{
            if(error)throw error
            if(result){
                return res.status(200).json({
                    "message":"Modification effectuée",
                    "error":"success"
                })
            }
        }).catch(function(error){
            return res.status(200).json({
                "message":"Catch : "+error,
                "error":"warning"
            })
        })
      

        console.log(req.body)
    }
}