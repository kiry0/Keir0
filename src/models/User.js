const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName:
            {
                type: String
            },
        middleName: 
            {
                type: String
            },
        lastName: 
            {
                type: String
            },
        emailAddress: 
            {
                type: String
            },
        phoneNumber: {
            countryCallingCode: {
                type: Number,
            },
            nationalNumber: {
                type: Number
            },
            number: {
                type: String
            }
        },
        username:
            {
                type: String
            },
        password: {
            type: String
        },
        token:
            {
                type: String
            },
        permissionLevel: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isVerified: {
            type: Boolean,
            enum: [
                false,
                true
            ],
            default: false
        },
        verificationCode: {
            code: {
                type: String
            },
            generatedAt: {
                type: Date,
                default: Date.now()
            }
        }
    }
);

module.exports = mongoose.model('User', userSchema);