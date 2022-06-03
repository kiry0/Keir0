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
            default: 1
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('User', userSchema);