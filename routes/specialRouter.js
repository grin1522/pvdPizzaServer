const express = require('express');
const bodyParser = require('body-parser');
const Special = require('../models/special');
const authenticate = require('../authenticate');
const cors = require('./cors');

const specialRouter = express.Router();

specialRouter.use(bodyParser.json());

specialRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Special.find()
    .then(specials => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(specials);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Special.create(req.body)
    .then(special => {
        console.log('Special Created ', special);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(special);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /specials');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Special.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

specialRouter.route('/:specialId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Special.findById(req.params.specialId)
    .then(special => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(special);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /specials/${req.params.specialId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Special.findByIdAndUpdate(req.params.specialId, {
        $set: req.body
    }, { new: true })
    .then(special => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(special);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Special.findByIdAndDelete(req.params.specialId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = specialRouter;