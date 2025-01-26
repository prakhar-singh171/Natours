const express = require('express');
const router = express.Router();

const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

//ROUTES
router.get('/', viewsController.getOverivew);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login',  viewsController.getLoginForm);

module.exports = router;