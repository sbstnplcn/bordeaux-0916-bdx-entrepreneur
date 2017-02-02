'use strict'
let Controller = require('./Controller'),
    formidable = require('formidable'),
    fs = require('fs'),
    path = require('path'),
    sg = require('../middlewares/sendgrid'),
    bcrypt = require('../middlewares/bcrypt'),
    generator = require('generate-password');

let password = generator.generate({
    length: 10,
    numbers: true
});
const COMPANY = require('../models/company')
const USER = require('../models/user')


class CompanyController extends Controller {
    constructor() {
        super(COMPANY);
    }

    upload(req, res, next) {
        // parse a file upload
        let form = new formidable.IncomingForm();

        form.uploadDir = './public/img/'

        if (!fs.existsSync(form.uploadDir)) fs.mkdirSync(form.uploadDir)

        form.on('file', (field, file) => {
                fs.rename(file.path, form.uploadDir + file.name)
            })
            .on('end', () => {
                console.log("uploaded")
                res.sendStatus(200)
            })

        form.parse(req)
    }

    create(req, res, next) {
        this.companyId;
        let contacts = req.body.contacts

        this.model.create(req.body.company, (err, document) => {
            if (err) next(err)
            else {
                this.companyId = document._id
                if (contacts) {
                    let company = {}
                    company._id = this.companyId
                    company.newContacts = contacts
                    this.updateOrCreate(company).then((users) => {
                        delete company.newContacts
                        this.model.findById(company._id, (err, company) => {
                            company.contacts = company.contacts.concat(users)
                            company.save()
                            res.json(company)
                        })
                    })
                }

            }
        })
    }

    update(req, res, next) {
        if (req.body.newContacts) {
            this.updateOrCreate(req.body).then((users) => {
                this.model.findById(req.params.id, (err, company) => {
                    company.contacts = company.contacts.concat(users)
                    company.save()
                    res.json(company)
                })
            })
        } else {
            this.updateUserCompany(req).then(() => {
                this.model.update({
                    _id: req.params.id
                }, req.body, (err, document) => {
                    if (err) next(err)
                    else res.sendStatus(200)
                })
            })
        }
    }

    updateUserCompany(req) {
        return Promise.all(req.body.contacts.map((user) => {
            return new Promise((resolve, reject) => {
                USER.findOne({
                    _id: user._id
                }, (err, editedUser) => {
                    if (err) reject(err)
                    let newParamUser = user.company.find(el => el.company == req.params.id)
                    editedUser.company = editedUser.company.map((e) => {
                        return e.company == req.params.id ? e = newParamUser : e
                    })
                    editedUser.save()
                    resolve(editedUser)
                })
            })
        }))
    }


    updateOrCreate(company) {
        return Promise.all(company.newContacts.map((contact) => {
            return new Promise((resolve, reject) => {
                USER.findOne({
                    email: contact.email
                }, (err, user) => {
                    if (err) reject(err)
                    if (user) {
                        user.company.push({
                            company: company._id,
                            role: contact.fondateur ? 'Fondateur' : 'Other'
                        })
                        user.save()
                        resolve(user)
                    } else if (!user) {
                        contact.company = [{
                            company: company._id,
                            role: contact.fondateur ? 'Fondateur' : 'Other'
                        }]
                        contact.password = bcrypt.password.cryptIt(password)

                        USER.create(contact, (err, user) => {
                            if (err) reject(err)
                            else {
                                user.New = true
                                user.password = password
                                sg.sendgrid.emailIt(user)
                                resolve(user)
                            }
                        })
                    }

                })

            })
        }))
    }

    findOne(req, res, next) {
        let search = new RegExp("(" + req.params.recherche + ")", "igm")
        this.model.find({
            $or: [{
                'name': search
            }, {
                'secteur': search
            }, {
                'tags': search
            }],
            'active': true
        }, (err, companies) => {
            if (err) next(err)
            else
                res.json(companies)
        });
    }


    findById(req, res, next) {
        this.model.findById(req.params.id).populate('contacts').exec((err, documents) => {
            res.json(documents)
        })
    }

    findActive(req, res, next) {
        this.model.find({
            'active': true
        }, (err, companies) => {
            if (err) next(err)
            else
                res.json(companies)
        })
    }
}
module.exports = CompanyController
