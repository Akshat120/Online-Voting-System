const Vote = require('../models/Vote');
const ObjectId = require('mongodb').ObjectId;


exports.createvotingprocess_page = function(req,res){
    let user = req.session.user;
    res.render('createvotingprocess_page',{
        username:user.username
    });
}

exports.createvotingprocess = function(req,res){
    console.log(req.body);
    res.send('creating voting process');
}





