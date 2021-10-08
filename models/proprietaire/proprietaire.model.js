const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

//Protrietaire Schema
const ProprietaireSchema = new Schema({

    cin: {
        type: String
    },
    passport: {
        type: String,
    },
    carte_sejour: {
        type: String,
    },
    nom_prenom: {
        type: String,
    },
    raison_social: {
        type: String,
    },
    n_registre_commerce: {
        type: String,
    },
    telephone: {
        type: Number,
    },
    fax: {
        type: Number,
    },
    adresse: {
        type: String,
    },
    n_compte_bancaire: {
        type: Number,
        unique: true,
        required: true
    },
    banque: {
        type: String,
        required: true
    },
    montant_loyer: {
        type: Number,
    },
    nom_agence_bancaire: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    mandataire: {
        type: Boolean,
        default: false
    },
    mois: {
        type: String
    },
    annee: {
        type: String
    }
},
    { timestamps: true, },
);

ProprietaireSchema.plugin(uniqueValidator);
const Proprietaire = mongoose.model('Proprietaire', ProprietaireSchema);
module.exports = Proprietaire;