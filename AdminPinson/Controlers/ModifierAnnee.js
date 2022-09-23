const ModelAnnee = require("../Models/Annee")

module.exports = {

    ModifierAnner : function(req, res){
        const {valeur, id } = req.body 
        
        if(valeur){
            ModelAnnee.findOne({
                active : true,
            }).then((response)=>{
                if(response){
                    return res.status(200).json({
                        "message":"Y a l'année qui est active",
                        "error":"warning"
                    })
                }
                if(!response){
                    ModelAnnee.findOneAndUpdate({
                        _id : id
                    }, {
                        $set:{
                            active : valeur
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
            })
        }else{
            ModelAnnee.findOneAndUpdate({
                _id : id
            }, {
                $set:{
                    active : valeur
                }
            }, null, (error, result)=>{
                    if(error){
                        res.status(200).json({
                            "message":"errer:"+error,
                            "error":"false"
                        })
                    }
                    if(result){
                        return res.status(200).json({
                            "message" :  "Opération effectuée",
                            "error":"sucess"
                        })
                    }    
            })
        }
    
    }
}