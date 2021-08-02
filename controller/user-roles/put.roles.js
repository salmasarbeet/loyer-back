const userRoles = require('../../models/roles/roles.model')

module.exports = {
    updateUserRoles: async (req, res) => {
        let item = 0;
        let allUserRoles = []
        for (item in req.body.userRoles) {
            await allUserRoles.push({
                roleName: req.body.userRoles[item].roleName
            })
        }
        await userRoles.findByIdAndUpdate(req.params.Id,
            {
                userMatricul: req.body.userMatricul,
                name: req.body.nom,
                prenom: req.body.prenom,
                userRoles: allUserRoles
            })
            .then((data) => {
                res.json(data)
            })
            .catch((error => {
                res.status(400).send({ message: error.message } || "Can't Update User Roles")
            }))
    }
}