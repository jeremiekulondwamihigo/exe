const modelOption = require("../Models/Small")
const modelEleve = require("../Models/EleveInscrits")

module.exports = {

    Options : function(req, res){
        try {
            
        const { option } = req.body
        if(option === null || option === "" ){
            return res.status(200).json({
                "message":"Veuillez remplir les champs",
                "error": "warning"
            })
        }

        modelOption.findOne({
            option : option
        }).then(optionFound=>{
            if(optionFound){
                return res.status(200).json({
                    "message":"L'option existe déjà",
                    "error": "warning"
                })
            }
            if(!optionFound){
                modelOption.create({option}).then(optionCreate=>{
                    if(optionCreate){
                        return res.status(200).json({
                            "message":"Option enregitrée",
                            "error": "success"
                        })
                    }else{
                        return res.status(200).json({
                            "message":"Erreur d'enregistrement",
                            "error": "warning"
                        })
                    }
                })
            }
        })

        } catch (error) {
            return res.status(200).json({
                "message":"Erreur :"+error,
                "error": "warning"
            })
        }
        
    }, 
    Section : function(req, res){
        const { optionID, section } = req.body

        if(optionID === ""|| optionID === undefined || section === "" || section === undefined){
            return res.status(200).json({
                "message":"Veuillez remplir les champs",
                "error":"warning"
            })
        }
               
       modelOption.findOne({
           _id : optionID
       }).then(response=>{
           const valeurTab = []
           for(let i =0; i < response.section.length; i++){
                valeurTab.push(response.section[i])
           }
           valeurTab.push(section)

           modelOption.findOneAndUpdate({
            _id : optionID
        }, {
            $set:{
                section : valeurTab
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
                        "message" :  "Opération effectuée",
                        "error":"success"
                    })
                }    
        })

       })
    },
    MakeFalse : (req, res)=>{
        const { id, active } = req.body

        modelEleve.findOneAndUpdate({
            _id : id
        }, {
            $set:{
                active : !active
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
                        "message" :  "Opération effectuée",
                        "error":"success"
                    })
                }    
        })
    }
}