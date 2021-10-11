const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const archiveVirementSchema = new Schema({
    archiveVirement: [{
        type: String
    }],
     mois:{
        type:String
    },
    annee:{
        type:String
    }
},{timestamps: true})

const ArchiveVirement = mongoose.model("ArchiveVirement", archiveVirementSchema)

module.exports = ArchiveVirement