const { types } = require('joi');
const { Types } = require('mongoose');
const { extrawork } = require('../models');
const User = require('../models/user.model')

// create extra work user
const createExtraWork = async (payload) => {
  return extrawork.create(payload)
};

// find by id extrawork user
const getextraworkuserId = async (id) => {
  return await extrawork.findById(id);
};

// update status in extrawoekuser
const statusupdate = async (id, data) => {
  return await extrawork.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        status: data.status,
      },
    },
    {
      new: true,
    }
  );
};

// Date and time update in extraworkuser
const timeupdate = async (id, data) => {
  return await extrawork.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        date: data.date,
        entertime: data.entertime,
        exittime: data.exittime,
      },
    },
    {
      new: true,
    }
  );
};

// delete extraworksuer
const deleteExtraWork = async (id, data) => {
  return await extrawork.findByIdAndDelete(
    { _id: id },
    {
      $set: {
        data: data,
      },
    }
  );
};

const getAll = async (id) => {
  const loginuser = await extrawork.find({employee: id}).populate({path:'employee'})
  return loginuser
}

module.exports = {
  createExtraWork,
  getextraworkuserId,
  statusupdate,
  timeupdate,
  deleteExtraWork,
  getAll,
};
