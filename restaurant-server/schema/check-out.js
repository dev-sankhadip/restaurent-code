const joi = require('joi');
const validateRequest = require('../middleware/validate-request');

const addressValidationObject = joi.string()
    .when('orderType',
        {
            is: 'D',
            then: joi.when('addrId', {
                is: null,
                then: joi.required(),
                otherwise:
                    joi.allow('', null)
            }),
            otherwise:
                joi.allow('', null)
        })

const CheckOutSchema = joi.object({
    secPhoneNumber: joi.string()
        .length(12)
        .pattern(/^[0-9]+$/)
        .allow('', null)
        .label("Secondary Phone Number"),
    orderType: joi.string()
        .length(1)
        .valid('D', 'P')
        .label("Order Type")
        .required(),
    deliveryArea: joi.string()
        .when('orderType',
            {
                is: 'D',
                then: joi.when('addrId', {
                    is: null,
                    then: joi.string().length(2)
                        .required(),
                    otherwise:
                        joi.allow('', null)
                }),
                otherwise:
                    joi.allow('', null)
            }),
    fullAddr: addressValidationObject,
    zipCode:
        joi.number()
            .when('orderType',
                {
                    is: 'D',
                    then: joi.when('addrId', {
                        is: null,
                        then: joi.required(),
                        otherwise:
                            joi.allow('', null)
                    }),
                    otherwise:
                        joi.allow('', null)
                }),
    landmark: addressValidationObject,
    state: addressValidationObject,
    paymentMethod: joi.string().valid('C').length(1).required()
        .messages({
            "any.only": "Payment Method must be Card"
        }),
    token: joi.alternatives().conditional('paymentMethod', { is: 'C', then: joi.string().required(), otherwise: joi.string().allow('', null) }),
    name: joi.string().allow('', null).label("Acount Holder Name"),
    email: joi.string().email().allow('', null).label("Email"),
    addrId: joi.string().allow(null).required().label("Selected Address"),

    username: joi.string().required().label("Username")
})



const ValidaCheckoutSchema = (request, response, next) => {
    validateRequest(request, response, next, CheckOutSchema);
}

module.exports = {
    ValidaCheckoutSchema
}