const router = require('express').Router();
const userController = require('./controller/userController')
const voteController = require('./controller/voteController')

// user route
router.get('/',userController.login_page);
router.post('/login',userController.login);
router.get('/register',userController.register_page);
router.post('/register',userController.register);
router.get('/emailconfirm',userController.emailconfirm_page);
router.post('/emailconfirm',userController.emailconfirm);
router.get('/user/:id',userController.authenticateToken,userController.dashboard);
router.get('/logout',userController.authenticateToken,userController.logout);
router.post('/resendemailconfirm',userController.authenticateToken,userController.resendcode);

// vote route
router.get('/create-voting-process',userController.authenticateToken,voteController.createvotingprocess_page);
router.post('/create-voting-process',userController.authenticateToken,voteController.createvotingprocess);
router.get('/manage-voting-process',userController.authenticateToken,voteController.managevotingprocess_page)
router.get('/vote-dashboard/:id',userController.authenticateToken,voteController.vote_dashboard);
router.get('/vote-dashboard/:id/voters',userController.authenticateToken,voteController.voters_page);
router.get('/vote-process-verification',userController.authenticateToken,voteController.vote_process_verification_page);
router.post('/confirm-vote-key',userController.authenticateToken,voteController.confirm_vote_key);
router.get('/vote-page/:id',userController.authenticateToken,voteController.vote_page);
router.post('/voted/:id',userController.authenticateToken,voteController.voted);

module.exports = router

