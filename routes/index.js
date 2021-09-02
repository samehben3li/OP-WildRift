var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  let query = "SELECT id,nom,img FROM champs ORDER BY nom"
  await connection.query(query, (err, champs) => {
    if (err) {
      console.log(err)
    }
    res.render("index", { champs: champs })
  })
})
router.get("/:id", async (req, res) => {
  let query = "SELECT * FROM champs WHERE id = " + req.params.id
  await connection.query(query, (err, champ) => {
    let listIdItems = champ[0].items.split(" ")
    let listIdRunes = champ[0].runes.split(" ")
    let queryInfo = "SELECT * FROM item WHERE item.idit IN (" + listIdItems.join(",") + ");"
    queryInfo += "SELECT * FROM spell WHERE spell.idsp IN (" + champ[0].spells.replace(/ /g, ",") + ");"
    queryInfo += "SELECT * FROM item WHERE idit = " + champ[0].itac + ";"
    queryInfo += "SELECT * FROM rune WHERE idrn IN (" + champ[0].runes.replace(/ /g, ",") + ");"
    queryInfo += "SELECT * FROM abilite WHERE ref = " + champ[0].id + " ORDER BY typ; "
    connection.query(queryInfo, (err, info) => {
      if (!err) {
        let items = []
        for (let i = 0; i < 6; i++) {
          items.push(info[0].find(x => x.idit == listIdItems[i]))
        }
        res.render("champ", { champ: champ[0], items: items, spells: info[1], itac: info[2][0], runes: info[3], abilites: info[4] })
      } else {
        console.log(err)
      }
    })
  })
})

module.exports = router;
