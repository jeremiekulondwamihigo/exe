const  express = require("express")
const { ModifierAnner } = require("../Controlers/ModifierAnnee")
const { ModifierEleve } = require("../Controlers/ModifierEleve")
const { Images } = require("../Controlers/Images")
const multer = require("multer")
const { Section } = require("../Controlers/Small")
const { Affectation, ModifierCours } = require("../Controlers/Cours")
const { upDateAgent, PermissionAgent} = require("../Controlers/Agent")
const { TitulaireClasse } = require("../Controlers/NavBar")

const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'AdminPinson/ImagesEleves')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})
var upload = multer({ storage: storage })

router.post("/photoEleve", upload.single("file"), Images)
router.put("/anneeModifier", ModifierAnner)
router.put("/eleve", ModifierEleve)
router.put("/section", Section)
router.put("/cours", Affectation)
router.put("/updateAgent", upDateAgent)
router.put("/titulaireAffectation", TitulaireClasse)
router.put("/permission", PermissionAgent)
router.put("/coursModifier", ModifierCours)



module.exports = router