'use strict';

const express = require('express');

let router = express.Router();

const User = require('../models/user');

const Yelp = require('yelp');

let yelp = new Yelp({
	consumer_key: process.env.YELP_CONSUMER_KEY,
	consumer_secret: process.env.YELP_CONSUMER_SECRET,
	token: process.env.YELP_TOKEN,
	token_secret: process.env.YELP_TOKEN_SECRET
});

router.post('/addFavorite/:yelpId', User.authorize({ admin: false }), (req, res) => {
	console.log('req.body:', req.body);
	let businesses = {
		yelpId: req.params.yelpId,
		name: req.body.name
	};
	User.findByIdAndUpdate(req.user._id, { $push: { "businesses": businesses } }, { new: true }, (err, savedProfile) => {
		res.status(err ? 400 : 200).send(err || savedProfile);
	});
});

router.delete('/deleteFavorite/:yelpId', User.authorize({ admin: false }), (req, res) => {
	console.log('req.user:', req.user);
	console.log('req.params.yelpId:', req.params.yelpId);
	User.findOneAndUpdate({ _id: req.user._id }, { $pull: { "businesses": { yelpId: req.params.yelpId } } }, { new: true }, (err, savedProfile) => {
		res.status(err ? 400 : 200).send(err || savedProfile);
	});
});

router.get('/searchById/:yelpId', (req, res) => {
	yelp.business(req.params.yelpId)
		.then(data => {
			res.status(200).send(data);
		})
		.catch(err => {
			res.status(400).send(err);
		})
})

router.get('/search/:term/:loc', (req, res) => {
	// console.log('req.params', req.params);
	yelp.search({
			term: req.params.term,
			location: req.params.loc,
			limit: 20
		})
		.then(data => {
			// console.log(data.businesses.length);
			res.status(200).send(data);
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

router.get('/countFavorites/:yelpId', (req, res) => {
	User.find({ "businesses.yelpId": req.params.yelpId }, (err, users) => {
		res.status(err ? 400 : 200).send(err || users.length.toString());
	});
});

module.exports = router;
