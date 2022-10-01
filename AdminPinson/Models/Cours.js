const mongoose = require("mongoose")

const schemaCours = mongoose.Schema({
    id: {type:Number,required:true},
    branche : {type:String, required:true},
    maxima : {type:Number, required:true},
    classe : {type:String, required:true},
    enseignant: {type:String, required:false, default:""},
    idCours : {type:String, required:true,},
    validExamen : {type:Boolean, required:true, default:true},
    identifiant : { type:String, required:false, default:undefined },
})
let valeur = new mongoose.model("Cours", schemaCours)
module.exports = valeur