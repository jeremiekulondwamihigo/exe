const modelEleve = require("../Models/EleveInscrits")

module.exports = {
    DeleteEleve : async (request, response)=>{
        try {
            const id = request.params.id;
        await modelEleve.findOneAndDelete(id).exec().then((response)=>{
            if(response){
                return response.status(200).JSON({"message" : "Suppression effectuer",
                    "error":"false"})
            }else{
                return response.status(200).JSON({"message" : "Erreur de suppression",
                    "error":"true"})
            }});} catch (error) {}
    },
}