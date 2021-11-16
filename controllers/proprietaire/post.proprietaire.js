const Proprietaire = require('../../models/proprietaire/proprietaire.model')
const ProprietaireValidation = require('../../validation/proprietaire.validation')
const Lieu = require('../../models/lieu/lieu.model')

module.exports = {

    // Ajouter un propriétaire 
    postProprietaire: async (req, res) => {

        console.log(req.body);

        try {

            // L'obligation d'au moin un cin ou passport ou carte sejour
            if ((req.body.cin == '' && req.body.passport == '' && req.body.carte_sejour == '')) {
                return res.status(422).send({ message: `Propriétaire doit contenir au moin Cin ou Passport ou Carte séjour` }
                )
            }

            // Lancer Joi Validation
            const validatedProprietaire = await ProprietaireValidation.validateAsync(req.body)

            // La validation d'unicité du Proprietaire
            const ValidateCinProprietaire = await Proprietaire.findOne({ cin: req.body.cin })
            const ValidatePassportProprietaire = await Proprietaire.findOne({ passport: req.body.passport })
            const ValidateCarteSejourProprietaire = await Proprietaire.findOne({ carte_sejour: req.body.carte_sejour })

            if (ValidateCinProprietaire) {
                if (ValidateCinProprietaire.cin != '') return res.status(422).send({ message: `Cin est déja pris` })
            }
            if (ValidatePassportProprietaire) {
                if (ValidatePassportProprietaire.passport != '') return res.status(422).send({ message: `Passport est déja pris` })
            }
            if (ValidateCarteSejourProprietaire) {
                if (ValidateCarteSejourProprietaire.carte_sejour != '') return res.status(422).send({ message: `Carte séjour est déja pris` })
            }

            
                const proprietaire = new Proprietaire({
                    deleted: false,
                    cin: req.body.cin,
                    passport: req.body.passport,
                    carte_sejour: req.body.carte_sejour,
                    nom_prenom: req.body.nom_prenom,
                    raison_social: req.body.raison_social,
                    n_registre_commerce: req.body.n_registre_commerce,
                    telephone: req.body.telephone,
                    fax: req.body.fax,
                    adresse: req.body.adresse,
                    n_compte_bancaire: req.body.n_compte_bancaire,
                    banque: req.body.banque,
                    banque_rib: req.body.banque_rib,
                    ville_rib: req.body.ville_rib,
                    cle_rib: req.body.cle_rib,
                    taux_impot: req.body.taux_impot, 
                    retenue_source: req.body.retenue_source,
                    montant_apres_impot: req.body.montant_apres_impot,
                    montant_loyer:req.body.montant_loyer,
                    nom_agence_bancaire: req.body.nom_agence_bancaire,
                    montant_avance_proprietaire: req.body.montant_avance_proprietaire,
                    tax_avance_proprietaire: req.body.tax_avance_proprietaire,
                    tax_par_periodicite: req.body.tax_par_periodicite,
                    pourcentage_caution: req.body.pourcentage_caution,
                    caution_par_proprietaire:  req.body.caution_par_proprietaire,
                    is_mandataire: req.body.is_mandataire,
                    has_mandataire: null,
                })

                await proprietaire.save()
                    .then(async (data) => {
                        await Lieu.findByIdAndUpdate({_id: req.params.Id_lieu},{$push: {proprietaire: data._id}})

                        // Update the Proprietaire list 
                        // if (req.body.is_mandataire && req.body.proprietaire_list.length > 0) {
                        //     for (let i = 0; i < req.body.proprietaire_list.length; i++) {
                        //         await Proprietaire.findByIdAndUpdate(req.body.proprietaire_list[i], {
                        //             has_mandataire:  data._id ,
                        //         })
                        //         .then((data) => {
                        //             res.send(data)
                        //         })
                        //         .catch((error) => {
                        //             if (error.code == 11000) {
                    
                        //                 return res.status(422).send({ message: `Numéro compte bancaire est déja pris` })
                    
                        //             } else {
                        //                 return res.status(500).send({ message: `Error de modification le propriétaire` || error })
                        //             }
                        //         })  
                        //     }
                        // }

                        res.json(data)
                    })
                    .catch((error) => {
                        if (error.name == 'ValidationError') {
                            if (error.errors.n_compte_bancaire) return res.status(422).send({ message: `Numéro compte bancaire est déja pris` })
                            // if (error.errors.n_compte_bancaire) return res.status(422).send({ message: error.message })
                        } else {
                            res.status(500).send({ message: `Error d'ajouter un propriétaire` || error })
                        }
                    })
            
        } catch (error) {
            res.status(422).send({
                message: error.message || `Validation error: ${error}`
            })
        }

    },
}
