import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: Male | Female | Other,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
    motherTongue: {
        type: String,
        required: true,
    },
    knownLanguages: [
        {
            type: String,
        }
    ]

}, {timestamps: true})

export const User = mongoose.model('User', userSchema);