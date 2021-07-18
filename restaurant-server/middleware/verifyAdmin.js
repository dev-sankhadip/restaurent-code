const { VerifyAdminDetails } = require("../lib/CommonFunctions")

module.exports = {
    VerifyAdmin: async (req, res, next) => {
        try {
            const IsAdmin = await VerifyAdminDetails(req);
            if (IsAdmin)
                next()
            if (!IsAdmin)
                res.status(401).send({ IsOpen })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}