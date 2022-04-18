const catchAsync = require('../utils/catchAsync')
const { extraworkService } = require('../services');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');


const extrework = catchAsync(async (req, res) => {
    const data = await extraworkService.createExtraWork({ ...req.body, employee: req.user._id })
    res.send({ data })
})

const statusupdate = catchAsync(async (req, res) => {
    const extraworkuser = await extraworkService.getextraworkuserId(req.params.extraworkbyId)
    if (!extraworkuser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'extraworkuser are not found')
    }
    const update = await extraworkService.statusupdate(req.params.extraworkbyId, req.body)
    res.send({ update })
})

const timeupdate = catchAsync(async (req, res) => {
    const extraworkusers = await extraworkService.getextraworkuserId(req.params.extraworkbyId)
    if (!extraworkusers) {
        throw new ApiError(httpStatus.NOT_FOUND, 'extraworkuser are not found')
    }
    const update = await extraworkService.timeupdate(req.params.extraworkbyId, req.body)
    res.send({ update })
})

const deleteExtraWork = catchAsync(async (req, res) => {
    const extrawork = await extraworkService.getextraworkuserId(req.params.Id)
    if (!extrawork) {
        throw new ApiError(httpStatus.NOT_FOUND, 'extraworkuserId are not found')
    }
    await extraworkService.deleteExtraWork(extrawork._id)
   
    res.status(200).json({ success: true, msg: "extrawork delete sucessfully" })
})

const  extraworkuserditeal = catchAsync(async (req, res)=> {
    const data = await extraworkService.getAll(req.user._id)
    res.status(200).json({ data: data })
})


module.exports = {
    extrework,
    statusupdate,
    timeupdate,
    deleteExtraWork,
    extraworkuserditeal,
}