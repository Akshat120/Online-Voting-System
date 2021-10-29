const router = require('express').Router();
const userController = require('./controller/userController')

router.get('/',userController.login);
router.get('/register',userController.register);

module.exports = router

