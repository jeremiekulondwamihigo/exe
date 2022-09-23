const  express = require("express")
const { DeleteEleve } = require("../Controlers/Delete")

const router = express.Router();
router.delete("/deleteEleve/:id", DeleteEleve)


module.exports = router