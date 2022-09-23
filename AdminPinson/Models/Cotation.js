const mongoose = require("mongoose")

const schemaCotation = mongoose.Schema({
    id: {type:String,required:true},
    idCours : {type:String, required:true},
    codeEleve : {type:String, required:true},
    classe : {type:String, required:true},
    premierePeriode: {type:Number, required:false, default:0},
    deuxiemePeriode: {type:Number, required:false, default:0},
    examenOne: {type:Number, required:false, default:0},
    troisiemePeriode: {type:Number, required:false, default:0},
    quatriemePeriode: {type:Number, required:false, default:0},
    examenTwo: {type:Number, required:false, default:0}
})

let valeur = new mongoose.model("Cotation", schemaCotation)
module.exports = valeur