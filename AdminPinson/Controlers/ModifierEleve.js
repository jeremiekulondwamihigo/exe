const ModelEleve = require("../Models/Eleves")
const { isEmpty } = require("../Utils/Functions")


module.exports = {

    ModifierEleve : function(req, res){
        const { valeur, id } = req.body
        const { genre, nomComplet, dateNaiss, lieuNaissance } = valeur
        
        if(isEmpty(nomComplet) || isEmpty(genre)){
            return res.status(200).json({
                "message":"Le nom et le genre sont obligatoires",
                "error":"warning"
            })
        }

        ModelEleve.findOne({_id : id}).then(eleveFound=>{
            if(eleveFound){
                ModelEleve.findOneAndUpdate({
                    _id : id
                }, {
                    $set:{ 
                        nomComplet :nomComplet,
                        sexe : genre,
                        dateNaiss : dateNaiss, 
                        lieuNaissance : lieuNaissance
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
            }

        })
    }
}