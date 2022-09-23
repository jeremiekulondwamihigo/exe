const modelEleve = require("../Models/Eleves")

module.exports = {

    Images : (req, res) => {
        const { filename } = req.file;
        const { matricule } = req.body;
        
        modelEleve.findOne({
            codeEleve : matricule
        }).then((EleveFound)=>{
            if(EleveFound){
                modelEleve.create({
                    filename, matricule  
                }).then((response)=>{
                    if(response){
                        return res.status(200).json({
                            "message":"Image de l'élève enregistrée",
                            "error" : "false"
                        })
                    }else{
                        return res.status(200).json({
                            "message":"y a eu une erreur",
                            "error" : "true"
                        })
                    }
                })
    
            }else{
                return res.status(200).json({
                    "message":"Etudiant non trouvé",
                    "error" : "true"
                })
            }
        })
        
        
    }
}