'use strict';

const express = require('express');
const User = require('../models/user');

const request = require('request');

let router = express.Router();

// users.js
// /api/users

router.get('/', User.authorize({ admin: false }), (req, res) => {
	User.find({ email: { $ne: req.user.email } }, (err, users) => {
		res.status(err ? 400 : 200).send(err || users);
	});
});

// /api/users/profile
router.get('/profile', User.authorize({ admin: false }), (req, res) => {
	console.log('req.user:', req.user);
	res.send(req.user);
});

router.delete('/all', User.authorize({ admin: true }), (req, res) => {
	User.remove({}, err => {
		res.status(err ? 400 : 200).send(err);
	});
});

router.post('/signup', (req, res) => {
	// Register a new user
	User.register(req.body, (err, token) => {
		res.status(err ? 400 : 200).send(err || { token: token });
	});
});

router.post('/login', (req, res) => {
	// Authenticate a returning user
	User.authenticate(req.body, (err, token) => {
		res.status(err ? 400 : 200).send(err || { token: token });
	});
});

// login w/ facebook
router.post('/facebook', (req, res) => {
	console.log('req.body:', req.body); // data being send from provider

	// OAuth 'Handshake'
	// 1. use the Authorization Code (req.body.code) to request the Access Token
	// 2. use the Access Token to request the user's profile (data) from the provider
	// 3. use the user's profile (user id) to either:
	// a. create a new account in our database for the user
	// b. retrieve an existing user from our database
	// 4. generate a JWT and respond w/ it

	// birthday and location doesn't output for some reason
	var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'gender', 'picture'];
	var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
	var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
	console.log('params:', params);
	var params = {
		code: req.body.code,
		client_id: req.body.clientId,
		client_secret: process.env.FACEBOOK_SECRET,
		redirect_uri: req.body.redirectUri
	};
	// 1. use the Authorization Code (req.body.code) to request the Access Token
	// qs takes params and turns it into query string
	request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
		if (response.statusCode !== 200) {
			return res.status(400).send({ message: accessToken.error.message });
		}

		console.log('accessToken:', accessToken);
		// accessToken: { access_token: 'EAAQYuQLGeh8BAJwoZBMMOdNT33ZAChOJ81thDZCdFsSmoA6WqmXVD1SHPkNZAlQC2FGS4aXUWP2iIY2m6yIruMiM0w6tUjsiC8Pif7n7FSxZAughTl5SgM2a2ClHvl8iRFWPqRIwAAPF7ZAKtvl0WD5hksh0a14E0ZD',
		// token_type: 'bearer',
		// expires_in: 5181810 }

		// 2. use the Access Token to request/get the user's profile (data) from the provider
		request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
			if (response.statusCode !== 200) {
				return res.status(400).send({ message: profile.error.message });
			}

			console.log('profile:', profile);
			
			User.findOne({ facebook: profile.id }, (err, user) => {
				if (err) return res.status(400).send(err);
				if (user) {
					// Returning user

					// generate the token
					let token = user.generateToken();
					// respond with token
					res.send({ token: token }); // satellizer expects object with key-value pair 'token'
				} else {
					// New user

					// create user
					let newUser = new User({
							email: profile.email,
							displayName: profile.name,
							profileImage: profile.picture.data.url,
							facebook: profile.id
						})
						// save to db
					newUser.save((err, savedUser) => {
						if (err) return res.status(400).send(err);
						// generate the token
						let token = savedUser.generateToken();
						// respond with token
						res.send({ token: token }); // satellizer expects object with key-value pair 'token'
					});
				};
			});
		});
	});
});

module.exports = router;
