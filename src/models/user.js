'use strict'
let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({


    name: String,
    firstname: String,
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],
    address: {
        type: mongoose.Schema.Types.Mixed
    },
    social: {
        type: mongoose.Schema.Types.Mixed
    },
    number: String,
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    image: String,
    password: String,
    remarques: String,
    role: {
        type: String,
        enum: ['Admin', 'Foundateur', 'Other'],
        default: 'Other'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    fondateur: {
        type: Boolean,
        default: false
    },
    cofondateur: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

// creating and exporting model with the model method of mongoose.
module.exports = mongoose.model('User', userSchema);
