const Proprietaire = require('../../models/proprietaire/proprietaire.model')
const Foncier = require('../../models/foncier/foncier.model')
const Lieu = require('../../models/lieu/lieu.model')
const Contrat = require('../../models/contrat/contrat.model')

module.exports = {

    //Chercher touts les propriétaires
    getAllProprietaire: async (req, res) => {
        await Proprietaire.find({ deleted: false }).populate({ path: "proprietaire_list"}).sort( {updatedAt: 'desc'} )
            .then((data) => {
                // console.log('test' , data);
                res.send(data)
            })
            .catch((error) => {
                res.status(200).send({ message: `Aucun Propriétaire trouvé` || error })
            })
    },

    getAllProprietairefromFoncier: async (req, res) => {
        // , numero_contrat: "666/dr666"
        await Foncier.find({ deleted: false })
        .populate({ path: "proprietaire", populate:{ path: "proprietaire_list", match:{ deleted: false }  } , match:{ deleted: false } })
        .populate({ path: "lieu", populate:{ path: "lieu", select:"_id intitule_lieu", match:{ deleted: false } }, match:{ deleted: false } , select: "proprietaire lieu"})
        .populate({ path: "contrat", select: "numero_contrat"})
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res.status(402).send({ message: error.message });
        });
    },

    getIdFoncierByProprietaire : async (req , res) => {
         await Foncier.find({ deleted: false , proprietaire: req.params.Id } , '_id')
         .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.status(200).send({ message: `Aucun Lieu trouvé` || error })
        })
    },

    //Chercher propriétaires par ID
    getProprietairePerID: async (req, res) => {
        await Proprietaire.findById(req.params.Id)
            .then((data) => {
                res.send(data)
            })
            .catch((error) => {
                res.status(500).send({ message: `Aucun Propriétaire trouvé` || error })
            })
    },

    getCountProprietaire: async (req, res) => {
        await Proprietaire.countDocuments({deleted: false})
            .then((data) => {
                res.json(data)
            })
            .catch((error) => {
                res.status(402).send({message: error.message})
            })
    }

}
