const router = require('express').Router();
const userController = require('./controller/userController')

router.get('/',userController.login_page);
router.get('/register',userController.register_page);
router.post('/register',userController.register);
router.get('/emailconfirm',userController.authenticateToken,userController.emailconfirm_page);
router.post('/emailconfirm',userController.authenticateToken,userController.emailconfirm);
router.get('/user/:id',userController.authenticateToken,userController.dashboard);

module.exports = router
