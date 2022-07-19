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
            type: String
        },
        phoneNumber: {
            countryCallingCode: {
                type: String,
            },
            nationalNumber: {
                type: String
            },
            number: {
                type: String
            }
        },
        username: {
            type: String
        },
        password: {
            type: String
        },
        authorization: {
            permissionLevel: {
                type: Number,
                default: 0
            },
            tokens: {
                passwordReset: {
                    type: Array // TODO: Change to map();.
                }
            }
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
                    default: new Date()
                },
                expiresAt: {
                    type: Date,
                    default: new Date(new Date().setHours(new Date().getHours() + 24)) // 24HRS
                }
            }
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('User', userSchema);