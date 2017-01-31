let CompanyController = require('../controllers/CompanyController')
let auth = require('../middlewares/authorization')

module.exports = (app) => {
    // Create new controller
    let ctrl = new CompanyController();

    app.get('/companies', (req, res, next) => {
        return ctrl.find(req, res, next)
    })

    app.get('/activecompanies', (req, res, next) => {
        return ctrl.findActive(req, res, next)
    })

    app.get('/companies/:id', (req, res, next) => {
        return ctrl.findById(req, res, next)
    })

    app.get('/search/:recherche', (req, res, next) => {
        return ctrl.findOne(req, res, next)
    })

    app.get('/tags/:tags', (req, res, next) => {
        return ctrl.findTags(req, res, next)
    })

    app.post('/companies', (req, res, next) => {
        return ctrl.create(req, res, next)
    })

    app.post('/upload', (req, res, next) => {
        return ctrl.upload(req, res, next)
    })

    app.put('/companies/:id', (req, res, next) => {
        return ctrl.update(req, res, next)
    });

    app.delete('/companies/:id', (req, res, next) => {
        return ctrl.delete(req, res, next)
    })
}
