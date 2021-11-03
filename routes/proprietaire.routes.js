const express = require("express");

const getProprietaire = require("../controllers/proprietaire/get.proprietaire");
const postProprietaire = require("../controllers/proprietaire/post.proprietaire");
const putProprietaire = require("../controllers/proprietaire/put.proprietaire");
const deleteProprietaire = require("../controllers/proprietaire/delete.proprietaire");
const verifyRole = require("../middleware/verify-user-role");
const router = express.Router();

router
  .route("/proprietaire/tous/:matricule")
  .get(
    verifyRole.checkRoles("CDGSP", "CSLA"),
    getProprietaire.getAllProprietaire
  );
router
  .route("/proprietaire/:Id/:matricule")
  .get(
    verifyRole.checkRoles("CDGSP", "CSLA"),
    getProprietaire.getProprietairePerID
  );
router
  .route("/proprietaire/count/all")
  .get(getProprietaire.getCountProprietaire
);
router
.route("/proprietaire/lieu/lieu-by-proprietaire/:Id/:matricule")
.get(
  verifyRole.checkRoles("CDGSP", "CSLA"),
  getProprietaire.getIdLieuByProprietaire
);
router
  .route("/proprietaire/ajouter/:Id_lieu/:matricule")
  .post(
    verifyRole.checkRoles("CDGSP", "CSLA"),
    postProprietaire.postProprietaire
  );
router
  .route("/proprietaire/modifier/:Id/:matricule")
  .put(verifyRole.checkRoles("CDGSP", "CSLA"), putProprietaire.putProprietaire);
router
  .route("/proprietaire/supprimer/:Id/:matricule")
  .put(
    verifyRole.checkRoles("CDGSP", "CSLA"),
    deleteProprietaire.deleteProprietaire
  );

module.exports = router;