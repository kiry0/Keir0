const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String
        },
        middleName: {
            type: String
        },
        lastName: {
            type: String
        },
        emailAddress: {
            type: String,
            unique: true
        },
        phoneNumber: {
            countryCallingCode: {
                type: Number,
            },
            nationalNumber: {
                type: Number
            },
            number: {
                type: String,
                unique: true
            }
        },
        username: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        token: {
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
        verification: {
            isVerified: {
                type: Boolean,
                enum: [
                    false,
                    true
                ],
                default: false
            },
            code: {
                value: {
                    type: String
                },
                createdAt: {
                    type: Date,
                    default: Date.now()
                },
                expiresAt: {
                    type: Date,
                    default: new Date(new Date().setHours(new Date().getHours() + 24)) // 24HRS.
                }
            }
        }
    }
);

module.exports = mongoose.model('User', userSchema);