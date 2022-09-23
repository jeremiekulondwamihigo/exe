const mongoose = require("mongoose")

const schemaCotation = mongoose.Schema({
    id: {type:Number,required:true},
    annee : {type:String, required:false},
    idCours : {type:String, required:false},
    codeEleve : {type:String, required:false},
    classe : {type:String, required:true},
    premierePeriode: {type:Number, required:false},
    deuxiemePeriode: {type:Number, required:false},
    examenOne: {type:Number, required:false},
    troisiemePeriode: {type:Number, required:false},
    quatriemePeriode: {type:Number, required:false},
    examenTwo: {type:Number, required:false}
})
let valeur = new mongoose.model("CotationEssaie", schemaCotation)
module.exports = valeur