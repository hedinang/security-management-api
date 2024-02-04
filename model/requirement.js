const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const modelName = 'requirement';

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        index: true,
        default: () => uuidv4()
    },
    email: String,
    phone: String,
    kind_of_service: String,
    location: String,
    description: String,
    age: Object,
    shape: String,
    gender: String,
    specialty: String,
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
