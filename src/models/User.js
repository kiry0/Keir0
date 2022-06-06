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
            type: Number
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
            type: String
        }
    }
);

module.exports = mongoose.model('User', userSchema);