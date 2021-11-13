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
        //res.send('votecode: '+data.votecode+'\n'+'candcode: '+data.candcode);
        res.redirect(`/vote-dashboard/${data.insertedId.toString()}`);
    }).catch((err)=>{
        res.render('createvotingprocess_page',{
            username:req.session.user.username,
            err:err,
        });
    })
}   

exports.managevotingprocess_page = function(req,res){
    let user = req.session.user; 
    Vote.getallprocess(user.id).then((data)=>{
        res.render('managevote_page',{
            username:req.session.user.username,
            vote:data,
        })     
    }).catch((err)=>{
        res.send("Error: "+err); 
    })
}   

exports.vote_dashboard = function(req,res){
    Vote.find(req.params.id).then((data)=>{
        res.render('vote_dashboard',{
            username:req.session.user.username,
            data:data,
        });        
    }).catch((err)=>{
        res.send(err);
    })

}

exports.vote_process_verification_page = function(req,res){
    res.render('voteprocessverification_page',{
        username:req.session.user.username,
    });
}

exports.confirm_vote_key = function(req,res){
    Vote.find_votekey(req.body.votekey).then((data)=>{
        req.session.data = data;
        res.redirect(`/vote-page/${data._id}`);
    }).catch((err)=>{
        res.render('voteprocessverification_page',{
            username:req.session.user.username,
            err:err,
        });
    })
}

exports.vote_page = function(req,res){
    res.render('vote_page',{
        username:req.session.user.username,
        data:req.session.data
    });
}

exports.voted = function(req,res){
    Vote.voted(req.params.id,req.body.selected,req.session.user.email).then((data)=>{
        res.render('voted_page',{
            username:req.session.user.username,
        });
    }).catch((err)=>{
        res.render('vote_page',{
            username:req.session.user.username,
            data:req.session.data,
            err:err,
        })
    })
}

