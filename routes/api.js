'use strict';

const express = require('express');

let router = express.Router();

router.use('/users', require('./users'));
router.use('/businesses', require('./businesses'));
// basic CRUD for database (if present)
// router.use('/whatevers', require('./whatevers'));

module.exports = router;
