const joi = require('joi');
const { extraworkuser } = require("../config/extrawork");
const { objectId } = require('./custom.validation');

const extrawork = {
    body: joi.object().keys({
        date: joi.date().required(),
        entertime: joi.string().required(),
        exittime: joi.string().required(),
    }),
};

const extraworkusers = {
    param: joi.object().keys({
        extraworkbyId: joi.string().custom(objectId),
    }),
};

const statusupdate = {
    body: joi.object().keys({
        status: joi.string().required().valid(...extraworkuser),
    }),
};

const timeupdate = {
    body:joi.object().keys({
        date:joi.string().required(),
        entertime:joi.string().required(),
        exittime:joi.string().required(),
    })
}

const deleteuser = {
    param:joi.object().keys({
        Id : joi.string().custom()
    })
}



module.exports = {
    extrawork,
    statusupdate,
    extraworkusers,
    timeupdate,
    deleteuser,
   
};