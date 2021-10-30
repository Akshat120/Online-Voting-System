const router = require('express').Router();
const userController = require('./controller/userController')

router.get('/',userController.login_page);
router.post('/login',userController.login);
router.get('/register',userController.register_page);
router.post('/register',userController.register);
router.get('/emailconfirm',userController.emailconfirm_page);
router.post('/emailconfirm',userController.emailconfirm);
router.get('/user/:id',userController.authenticateToken,userController.dashboard);
router.get('/logout',userController.authenticateToken,userController.logout);

module.exports = router
