const mongodb = require('../model/index')
const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const message = require('../config/message');
const { v4: uuidv4 } = require('uuid');

const get = async (applicantId) => {
    let apiResponse = {}
    let result = await mongodb.Applicant.find({
        id: applicantId,
        status: { $nin: ['REMOVED'] }
    }).lean();
    if (result.length) {
        apiResponse.data = result[0];
    }

    apiResponse.status = httpStatus.StatusCodes.OK
    return apiResponse
}

const list = async (body) => {
    let apiResponse = {}

    try {
        if (!body.limit) body.limit = 10
        if (!body.page) body.page = 0
        const { limit, page, search } = body
        const cleanSearch = { status: { $nin: ['REMOVED'] } }
        if (search) {
            Object.entries(search)?.forEach(([key, value]) => {
                switch (key) {
                    case 'name':
                        if (value !== null && value?.trim() !== '') {
                            cleanSearch[key] = {
                                $regex: value?.trim(),
                                $options: "i"
                            }
                        }
                        break;
                    default:
                        break;
                }
            })
        }
        let result = await mongodb.Applicant.find(cleanSearch).limit(limit).skip((page - 1) * limit).sort({ _id: -1 }).lean();

        const total_items = await mongodb.Applicant.count(cleanSearch)

        apiResponse.data = {}
        apiResponse.data.items = result?.map(e => ({
            id: e?.id,
            name: e?.name,
            gender: e?.gender,
            yearOfBirth: e?.year_of_birth,
            phone: e?.phone,
            position: e?.position,
            location: e?.location,
            workingTime: e?.working_time,
            wage: e?.wage,
            support: e?.support,
            message: e?.message,
            status: e?.status,
            createdAt: e?.created_at
        }))
        apiResponse.data.total_items = total_items
        apiResponse.status = httpStatus.StatusCodes.OK
        return apiResponse
    } catch (error) {
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
        return apiResponse
    }
}

const add = async (body) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let apiResponse = {}
    try {
        if (body) {
            let result = await mongodb.Applicant.create(body);
            apiResponse.data = result;
            apiResponse.status = httpStatus.StatusCodes.OK
        }

        return apiResponse
    } catch (e) {
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
        return apiResponse
    }
}

const update = async (body, file) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let apiResponse = {}
    const { origin_url, name, ...data } = body
    if (name === null || name.trim() === '') {
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
        return apiResponse
    }

    try {
        if (body.id) {
            let applicant = await mongodb.Applicant.find({ id: body.id }).lean();
            if (applicant.length) {


                let applicantByName = await mongodb.Applicant.find({ name: name, id: { $ne: body.id } }).lean();
                if (applicantByName.length) {
                    apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
                    apiResponse.message = "Tên danh mục này đã tồn tại!";
                    return apiResponse
                }

                if (origin_url?.includes('https://music2023.s3')) {
                    data.img_url = origin_url
                } else {
                    if (file) {
                        const param = {
                            Bucket: 'music2023',
                            Key: `image/applicant/${uuidv4()}.${file.mimetype.split('/')[1]}`,
                            Body: file.buffer
                        }

                        const uploaded = await s3.upload(param).promise()
                        data.img_url = uploaded?.Location
                    } else {
                        data.img_url = null
                    }
                }

                await mongodb.Applicant.findOneAndUpdate({ id: body.id }, { ...data, name }, { new: true, session });
                apiResponse.status = httpStatus.StatusCodes.OK
                await session.commitTransaction();
            }
        }
        return apiResponse
    } catch (e) {
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
        return apiResponse
    }
}

const removeById = async (applicantId) => {
    let apiResponse = {}
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!applicantId) {
            throw Error("id hasn't existed !")
        }

        let result = await mongodb.Applicant.findOneAndUpdate({ id: applicantId }, { status: 'REMOVED' }, { new: true, session });
        apiResponse.data = result;
        apiResponse.status = httpStatus.StatusCodes.OK
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
    }
    return apiResponse
}

const remove = async (idList) => {
    let apiResponse = {}
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!idList.length) {
            apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
            apiResponse.message = "Have to contain at least 1 id!"
            return apiResponse
        }

        let result = await mongodb.Applicant.updateMany({ id: { $in: idList } }, { $set: { status: 'REMOVED' } }, { new: true, session });
        apiResponse.data = result;
        apiResponse.status = httpStatus.StatusCodes.OK
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        apiResponse.status = httpStatus.StatusCodes.BAD_REQUEST
        apiResponse.message = message.BAD_REQUEST;
    }
    return apiResponse
}


module.exports = {
    list,
    get,
    add,
    remove,
    update,
    removeById
}
