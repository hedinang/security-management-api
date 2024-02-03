const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const modelName = 'applicant';

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        index: true,
        default: () => uuidv4()
    },
    image: String,
    name: String,
    year_of_birth: Number,
    gender: String,
    phone: String,
    position: String,
    location: String,
    working_time: String,
    wage: {
        type: Number,
        index: true,
    },
    support: {
        type: String,
        index: true,
    },
    message: {
        type: String,
        index: true,
    },
    created_at: {
        type: String,
        index: true,
        default: new Date()
    },
    updated_at: {
        type: String,
        index: true,
        default: new Date()
    },
}, { versionKey: false });
const ApiSchema = mongoose.model(modelName, userSchema, modelName);

module.exports = ApiSchema;
