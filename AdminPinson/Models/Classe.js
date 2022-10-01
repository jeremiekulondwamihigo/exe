const mongoose = require("mongoose")

const schemaAnnee = mongoose.Schema({
    id:{type:String,required:true, unique:true},
    classe : { type:Number, required:true},
    title : {type:String, required:true},
    titulaire : {type:String, required:false, unique:true},
    codeClasse : {type:String, required:true, unique:true},
    auth_Domaine : { type:Boolean, required:true, default:false}
})

let valeur = new mongoose.model("Classe", schemaAnnee)
module.exports = valeur