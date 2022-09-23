const modelCotation = require("../Models/Cotation")


module.exports = {
    Session : (req, res)=>{
        varLookCours = { $lookup: {
            from: 'cours',
            localField: 'idCours',
            foreignField: 'idCours',
            as: 'collection',
          }
        }
        varGroup5 = { $group : {"_id" : "$codeEleve", 
                        "premiere": {$sum : "$premierePeriode $deuxiemePeriode"},
                        }};

        // varGroup = { $group : { "_id" : "$codeEleve" } };
        varMatch = { $match : { codeEleve : "3-PINSON2022", "collection.maxima" : {
            $lt:50,
            $not:{$gte:50}
        }  }}

        modelCotation.aggregate([ varLookCours, varMatch]).then((response)=>{
            res.send(response)
        })
        
        
    }
}