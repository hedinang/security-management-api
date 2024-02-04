const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const modelName = 'social';

const serviceSchema = new Schema({
    id: {
        type: String,
        required: true,
        index: true,
        default: () => uuidv4()
    },
    facebook: String,
    zalo: String,
    youtube: String,
    status: {
        type: String,
        index: true,
        default: 'ACTIVE'
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
const ApiSchema = mongoose.model(modelName, serviceSchema, modelName);

module.exports = ApiSchema;
