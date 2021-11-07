const Vote = require('../models/Vote');
const ObjectId = require('mongodb').ObjectId;


exports.createvotingprocess_page = function(req,res){
    let user = req.session.user;
    res.render('createvotingprocess_page',{
        username:user.username
    });
}   
    
exports.createvotingprocess = function(req,res){
    let vote = new Vote(req.body);
    let user = req.session.user;
    vote.createprocess(user.id).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.render('createvotingprocess_page',{
            username:req.session.user.username,
            err:err,
        });
    })
}   





