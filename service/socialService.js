const mongodb = require('../model/index')
const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const message = require('../config/message');

const getList = async () => {
    let apiResponse = {}
    try {
        let result = await mongodb.Social.find().lean();
        if (result.length) {
            apiResponse.data = result[0];
        }
        apiResponse.status = httpStatus.StatusCodes.OK
        return apiResponse
    } catch (error) {
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
        return apiResponse
    }
}

const update = async (body) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let apiResponse = {}
    try {
        if (body.id) {
            await mongodb.Social.findOneAndUpdate({ id: body.id }, { ...body }, { new: true, session });
            apiResponse.status = httpStatus.StatusCodes.OK
            await session.commitTransaction();
        }
        return apiResponse
    } catch (e) {
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
        return apiResponse
    }
}

module.exports = {
    getList,
    update
}
