const Lieu = require("../../models/lieu/lieu.model");

module.exports = {
  modifierLieu: async (req, res, next) => {
    //check lieu if already exist
    const codeLieuExist = await Lieu.findOne({ code_lieu: req.body.code_lieu });

    if (codeLieuExist) {
      if (codeLieuExist._id != req.params.Id && codeLieuExist.code_lieu != "") {
        return res.status(422).send({ message: "Le code lieu est deja pris" });
      }
    }

    await Lieu.findOne({ _id: req.params.Id }).then(async (lieuData) => {
      if (lieuData.intitule_lieu != req.body.intitule_lieu) {
        await Lieu.find({
          type_lieu: "Logement de fonction",
          attached_DR: lieuData._id,
        }).then((LfData) => {
          if (LfData.length > 0) {
            LfData.forEach(async (lieuLF) => {
              await Lieu.findByIdAndUpdate(
                { _id: lieuLF._id },
                {
                  intitule_lieu: `LF/${req.body.intitule_lieu}`,
                }
              );
            });
          }
        });
      }
    });

    let directeurRegional = [],
      item = 0;

    for (item in req.body.directeur_regional) {
      directeurRegional.push({
        matricule: req.body.directeur_regional[item].matricule,
        nom: req.body.directeur_regional[item].nom,
        prenom: req.body.directeur_regional[item].prenom,
        deleted_directeur: req.body.directeur_regional[item].deleted_directeur,
      });
    }

    await Lieu.findByIdAndUpdate(
      { _id: req.params.Id },
      {
        code_lieu: req.body.code_lieu,
        intitule_lieu: req.body.intitule_lieu,
        code_localite: req.body.code_localite,
        telephone: req.body.telephone,
        fax: req.body.fax,
        type_lieu: req.body.type_lieu,
        // code_rattache_DR: req.body.code_rattache_DR,
        // code_rattahce_SUP: req.body.code_rattahce_SUP,
        attached_DR: req.body.attached_DR,
        attached_SUP: req.body.attached_SUP,
        intitule_rattache_SUP_PV: req.body.intitule_rattache_SUP_PV,
        centre_cout_siege: req.body.centre_cout_siege,
        categorie_pointVente: req.body.categorie_pointVente,
        etat_logement_fonction: req.body.etat_logement_fonction,
        directeur_regional: directeurRegional,
        deleted: false,
      },
      { new: true }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(402).send({ message: error.message });
      });
  },
};
