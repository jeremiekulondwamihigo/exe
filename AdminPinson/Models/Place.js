const mongoose = require("mongoose")

const valeur = mongoose.Schema({
    codeEleve : {type:String, required:true},
    premierePeriode : {type:String, required:false, default:""},
    deuxiemePeriode :{type:String, required:false, default:""},
    totalOne : {type:String, required:false, default:""},
    troisiemePeriode : {type:String, required:false, default:""},
    quatriemePeriode : {type:String, required:false, default:""},
    totalGeneral : {type:String, required:false, default:""},
})
const modelVal = new mongoose.model("Place", valeur)
module.exports = modelVal