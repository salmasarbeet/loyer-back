const Contrat = require("../../models/contrat/contrat.model");
const etatTaxesSch = require("../../models/situation_cloture/etatTaxes.schema");
const etatVirementSch = require("../../models/situation_cloture/etatVirement.schema");
const archiveComptabilisation = require("../../models/archive/archiveComptabilisation.schema");
const traitementContratActif = require("../helpers/cloture/contrats_actif");
const traitementContratResilie = require("../helpers/cloture/contrats_resilie");
const generatePdf = require("../helpers/cloture/generateSituationPdf");

module.exports = {
  situation_cloture: async (req, res, next) => {
    try {
      let comptabilisationLoyerCrediter = [],
        montantDebiter = 0,
        comptabilisationLoyerDebiter = [],
        ordreVirement = [];

      //get current contrat of this month
      let contrat = await Contrat.find({
        deleted: false,
        "etat_contrat.libelle": { $in: ["Actif"] },
      }).populate({
        path: "foncier",
        populate: [
          { path: "proprietaire", populate: { path: "proprietaire_list" } },
          { path: "lieu.lieu" },
        ],
      });

      // return res.json(contrat);

      //traitement pour date generation de comptabilisation
      let dateGenerationDeComptabilisation = null;
      let result;
      if (req.body.mois == 12) {
        dateGenerationDeComptabilisation = new Date(
          req.body.annee + 1 + "-" + "01" + "-" + "01"
        );
      } else {
        dateGenerationDeComptabilisation = new Date(
          req.body.annee +
            "-" +
            ("0" + (req.body.mois + 1)).slice(-2) +
            "-" +
            "01"
        );
      }

      if (contrat.length > 0) {
        //comptabilisation pour le paiement des loyers
        for (let i = 0; i < contrat.length; i++) {
          //traitement pour comptabiliser les contrats Actif
          if (contrat[i].etat_contrat.libelle == "Actif") {
            result = await traitementContratActif.clotureContratActif(
              req,
              res,
              contrat[i],
              dateGenerationDeComptabilisation,
              Contrat
            );
            result.ordre_virement.forEach((ordVrm) => {
              ordreVirement.push(ordVrm);
            });
            result.cmptLoyerCrdt.forEach((cmptCrdt) => {
              comptabilisationLoyerCrediter.push(cmptCrdt);
            });
            result.cmptLoyerDebt.forEach((cmptDept) => {
              comptabilisationLoyerDebiter.push(cmptDept);
            });
          } //end if

          if (contrat[i].etat_contrat.libelle == "Résilié") {
            result = await traitementContratResilie.clotureContratResilie(
              req,
              res,
              contrat[i],
              dateGenerationDeComptabilisation,
              Contrat
            );
            result.ordre_virement.forEach((ordVrm) => {
              ordreVirement.push(ordVrm);
            });
            result.cmptLoyerCrdt.forEach((cmptCrdt) => {
              comptabilisationLoyerCrediter.push(cmptCrdt);
            });
            result.cmptLoyerDebt.forEach((cmptDept) => {
              comptabilisationLoyerDebiter.push(cmptDept);
            });
          }
        } //end for
      } else {
        return res.status(402).send({ message: "Data empty" });
      }

      //post ordre de virement dans ordre de virement archive
      const etatVirement = new etatVirementSch({
        ordre_virement: ordreVirement,
        date_generation_de_virement: dateGenerationDeComptabilisation,
        mois: req.body.mois,
        annee: req.body.annee,
      });
      //post comptabilisation des loyer dans comptabilisation des loyer archive
      const etatTaxes = new etatTaxesSch({
        comptabilisation_loyer_crediter: comptabilisationLoyerCrediter,
        comptabilisation_loyer_debiter: comptabilisationLoyerDebiter,
        date_generation_de_comptabilisation: dateGenerationDeComptabilisation,
        mois: req.body.mois,
        annee: req.body.annee,
      });
      etatVirement
        .save()
        .then(async (virementData) => {
          await etatTaxes
            .save()
            .then((comptabilisationData) => {
              // res.json(true);
              generatePdf(virementData, "état_virements");
              generatePdf(comptabilisationData, "état_taxes");
              res.json({
                virementData,
                comptabilisationData,
              });
            })
            .catch((error) => {
              res.status(402).send({ message: error.message });
            });
        })
        .catch((error) => {
          res.status(401).send({ message: error.message });
        });
    } catch (error) {
      res.status(402).json({ message: error.message });
    }
  },
};