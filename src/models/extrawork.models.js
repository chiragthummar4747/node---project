const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { extraworkuser } = require('../config/extrawork')

const extraworkSchema = mongoose.Schema(
    {
        employee: {
            type: mongoose.Types.ObjectId,
            ref: "User" 
        },
        date: { 
            type: String,
            required: true,
            default: Date.now,
        },
        entertime: {
            type: String,
            required: true 
        },
        exittime: {
            type:String,
            required: true 
        },
        status: {
            type: String,
            enum: extraworkuser,
            default: 'pending'
        },

    },
    {
        timestamps: true
    }
)

// add plugin that converts mongoose to json
extraworkSchema.plugin(toJSON);
extraworkSchema.plugin(paginate);

const extraworks = mongoose.model("extrawork", extraworkSchema)
module.exports = extraworks;