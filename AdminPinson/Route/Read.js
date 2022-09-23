const  express = require("express")
const { readClasse, readOptions, readAgent, 
    readAnnee, readEleves, readAgentById, readCoursParEnseignant, CoursParMax, readPeriode, 
    readEleveByClasse, readAnneeActive, ReadCoursInnocuper, readCotationEleve,ReadCoursParUnEleve, readCours, readTableStudentInitiale, readEleveEnOrdre
} = require("../Controlers/Read")
const { Branche, CotationEleve, ResultatClasse } = require("../Controlers/Bulletin")
const { Session } = require("../Controlers/Session")
const { retournUserId } = require("../Controlers/Login")
const { changeCote, AfficherEleveCoter, AfficherSessionClasse } = require("../Controlers/Cotation")
const { ReadUser } = require("../Controlers/Login")

const router = express.Router();
router.get("/classe", readClasse)
router.get("/annee", readAnnee)
router.get("/eleves", readEleves)
router.get("/anneeActive", readAnneeActive)
router.get("/option", readOptions)
router.get("/agent", readAgent)
router.get("/cours/:classe", readCours)
router.get("/eleveId/:classe", readEleveByClasse)
router.get("/periode", readPeriode)
router.get("/bulletin/:classe", Branche)
router.get("/cotation/:codeEleve", CotationEleve)
router.get("/coursParMaxima/:max/:value", CoursParMax)
router.get("/checkToken/:token", retournUserId)
router.get("/readAgentById/:codeAgent", readAgentById)
router.get("/readCoursParEnseignant/:idEnseignant", readCoursParEnseignant)
router.get("/touteleves", readTableStudentInitiale)
router.get("/recouvrement/:classe/:somme", readEleveEnOrdre)
router.get("/readPointCours/:idCours/:classe", readCotationEleve)
router.get("/session", Session)
router.get("/unCoursEleve/:idCours/:codeEleve", ReadCoursParUnEleve)
router.get("/retournUserId/:token", retournUserId)
router.get("/readUser", ReadUser)
router.get("/afficher/:codeClasse", AfficherEleveCoter)
router.get("/coursinnocuper", ReadCoursInnocuper)
router.get("/resultataclasse/:codeClasse", ResultatClasse)
router.get("/sessionclasse/:codeClasse", AfficherSessionClasse)

router.post("/test", changeCote)

module.exports = router