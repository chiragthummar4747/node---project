const express = require('express')
const {auth} = require('../../middlewares/auth')
const validate = require('../../middlewares/validate');
const extraworkvalidation = require('../../validations/extraworkvalidation')
const extraworkcontroller = require('../../controllers/extraworkcontroller');

const router = express.Router();

router
    .route('/')
    .post(auth(''), validate(extraworkvalidation.extrawork), extraworkcontroller.extrework)
    .delete(auth(''),validate(extraworkvalidation.deleteuser),extraworkcontroller.deleteExtraWork)
    .get(auth(''),extraworkcontroller.extraworkuserditeal)

router
    .route('/:extraworkbyId')
    .post(auth(''),validate(extraworkvalidation.statusupdate),extraworkcontroller.statusupdate)
    .put(auth(''),validate(extraworkvalidation.timeupdate),extraworkcontroller.timeupdate)


module.exports = router;


