const modelPeriode = require("../Models/Periode")


module.exports = {
    Periode : function(req, res){
        try {
            const { valeur } = req.params

            if(valeur === ""){
                return res.status(200).json({
                    "message":"Veuillez remplir le champs",
                    "error":"warning"
                })
            }

            modelPeriode.find({}).then(PeriodeFound =>{

                if(PeriodeFound.length <= 0){
                    modelPeriode.create({
                        id : 1, periode : valeur
                    }).then((periodeSave)=>{
                        if(periodeSave){
                           return res.status(200).json({"message":"Période enregistrée", "error":"success"})
                        }
                    })
                    
                }else{
                    modelPeriode.findOneAndUpdate({
                        
                    }, {
                        $set:{ 
                            periode : valeur,
                        }
                    }, null, (error, result)=>{
                            if(error){
                                return res.status(200).json({"message":"Période enregistrée", "error":"success"})
                            }
                            if(result){
                                return res.status(200).json({"message" : "periode "+valeur+" enregistrée","error":"success"})
                            }    
                    })
                }
            })
        } catch (error) {
            return res.status(200).json({
                "message":""+error,
                "error":"warning"
            })
        }
    }
}