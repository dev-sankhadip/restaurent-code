const { poolConnection } = require("../lib/DBConnection");
const logger = require("../lib/logger");
const { DBQueries } = require('../VO/constants');
const TupleDictionary = require("../lib/TupleDictionary");
const { CheckRestaurantOpenOrClose } = require("../lib/CommonFunctions");

const GetLookupValues = async (request, response) => {
    const { lookup_cat } = request.body;
    try {
        let query = DBQueries.GetLookupValues;
        if (lookup_cat)
            query = DBQueries.GetLookupValues + " And Lookup_Cat in (?)"
        const [rows] = await poolConnection.execute(query, lookup_cat ? [...lookup_cat] : []);
        if (rows.length > 0) {
            let lookupValues = new TupleDictionary();
            rows.map((item) => {
                let lookupDetails = [item.Lookup_Cat, item.Lookup_Val, item.Lookup_Desc];
                if (lookupValues.exists([item.Lookup_Cat]))
                    lookupValues.put([item.Lookup_Cat], lookupDetails)
                else
                    lookupValues.add([item.Lookup_Cat], lookupDetails)
            })
            response.status(200).send(lookupValues.get());
            return;
        }
        response.status(204).send({ data: [] });
    } catch (error) {
        logger.error(`Error:- ${error}`);
        response.status(500).send({ error });
    }
}


const GetDeliveryCharges = async (request, response) => {
    try {
        const { type } = request.query;
        let query = type == 'charge' ? DBQueries.GetDeliveryChargeList : DBQueries.GetMinOrderAmount;
        const [rows] = await poolConnection.execute(query);
        if (rows.length > 0) {
            response.status(200).send(rows);
            return;
        }
        response.status(204).send({ data: [] });
    } catch (error) {
        logger.error(`Error:- ${error}`);
        response.status(500).send({ error });
    }
}



const GetRestaurantTime = async (request, response) => {
    try {
        const IsOpen = await CheckRestaurantOpenOrClose();
        if (IsOpen[0])
            response.status(200).send({ IsOpen });
        if (!IsOpen[0])
            response.status(403).send({ IsOpen })
    } catch (error) {
        logger.error(`Error:- ${error}`);
        response.status(500).send({ error });
    }
}


const StripePublishableKey = (request, response) => {
    try {
        response.status(200).send(process.env.STRIPE_PUBLISHABLE_KEY);
    } catch (error) {
        logger.error(`Error:- ${error}`);
        response.status(500).send({ error });
    }
}

module.exports = {
    GetLookupValues,
    GetDeliveryCharges,
    GetRestaurantTime,
    StripePublishableKey
}