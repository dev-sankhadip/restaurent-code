const { CheckRestaurantOpenOrClose } = require("../lib/CommonFunctions")

module.exports = {
    CheckRestuTime: async (req, res, next) => {
        try {
            const IsOpen = await CheckRestaurantOpenOrClose();
            if (IsOpen)
                next();
            if (!IsOpen)
                res.status(403).send({ IsOpen })
        } catch (error) {
            response.status(500).send({ error });
        }
    }
}