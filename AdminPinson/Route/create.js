const  express = require("express")
const { Annee, Classe } = require("../Controlers/NavBar")
const { EnregistrementEleve } = require("../Controlers/Eleves")
const { Options, MakeFalse } = require("../Controlers/Small")
const { Agent } = require("../Controlers/Agent")
const { Cours } = require("../Controlers/Cours")
const { Periode } = require("../Controlers/Periode")
const { Cotation, multipleCote, CotationOther } = require("../Controlers/Cotation")
const { Place } = require("../Controlers/Place")
const { Registered, Login } = require("../Controlers/Login")
const { Ajouter_Domaine, AjouterSousDomaine } = require("../Controlers/Domaine")
 

const router = express.Router();

router.post("/annee", Annee)
router.post("/classe", Classe)
router.post("/eleve", EnregistrementEleve)
router.post("/option", Options)
router.post("/agent", Agent)
router.post("/cours", Cours)
router.post("/periode/:valeur", Periode)
router.post("/point", Cotation)
router.post("/cloturePeriode", Place)
router.post("/makeFalse/", MakeFalse)
router.post("/multipleCote/", multipleCote)
router.post("/registered", Registered)
router.post("/cotationOther", CotationOther)
router.post("/login", Login)
router.post("/ajouterdomaine", Ajouter_Domaine)
router.post("/ajoutersousDomaine", AjouterSousDomaine)

module.exports = router