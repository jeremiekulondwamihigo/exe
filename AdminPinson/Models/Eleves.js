const mongoose = require("mongoose")

const schemaEleve = mongoose.Schema({
    nomComplet : {type:String, required:true},
    sexe : {type:String, required:true},
    dateNaiss : {type:String, required:false, default:""},
    codeEleve : {type:String, required:true},
    id : {type:String, required:true},
    lieuNaissance : {type:String, required:false, default:""}
})

let valeur = new mongoose.model("Eleve", schemaEleve)
module.exports = valeur