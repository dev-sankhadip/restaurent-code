const joi = require('joi');
const validateRequest = require('../middleware/validate-request');



const VerifyClosingTime = (value, helpers) => {
    const { openTime } = helpers.state.ancestors[0];
    if (value < openTime)
        return helpers.error('any.invalid');
    return value;
}

const VerifyTimeFormat = (value, helpers) => {
    if (value > '23:59')
        return helpers.error('any.formaterrorgrt');
    return value;
}



const CheckOutSchema = joi.object({
    openTime: joi.string()
        .length(5)
        .regex(/^([0-9]{2})\:([0-9]{2})$/)
        .required()
        .custom(VerifyTimeFormat, 'Custom Validation')
        .label('Restaurent Opening Time')
        .messages({
            'string.pattern.base': "Opening Time must be in 24 Hour Time Format",
            'any.formaterrorgrt': "Time can't be greater then 23:59",
        }),
    endTime: joi.string()
        .length(5)
        .required()
        .regex(/^([0-9]{2})\:([0-9]{2})$/)
        .custom(VerifyClosingTime, 'Custom Validation')
        .custom(VerifyTimeFormat, 'Custom Validation')
        .label('Restaurent Closing Time')
        .messages({
            'string.pattern.base': "Closing Time must be in 24 Hour Time Format",
            'any.invalid': "Closing Time can't be less than Opening Time",
            'any.formaterrorgrt': "Time can't be greater then 23:59",
        })
    ,
    day: joi.number()
        .label("Day")
        .min(0)
        .max(6)
        .required(),
    month: joi.number()
        .label("Month")
        .min(1)
        .max(12)
        .required()
})


const ValidateRestuTimeSchema = (request, response, next) => {
    validateRequest(request, response, next, CheckOutSchema);
}

module.exports = {
    ValidateRestuTimeSchema
}