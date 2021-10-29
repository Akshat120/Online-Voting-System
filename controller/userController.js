const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login_page = function(req,res) {
    res.render('login_page');
}

exports.register_page = function(req,res) {
    res.render('register_page');
}

exports.register = async function(req,res) {
    let user = new User(req.body);
    //console.log(user);
    await user.register().then((data)=>{
        req.session.user = {
            id:data.insertedId.toString(),
            email:user.data.email,
        }
        console.log(req.session.user);
        req.session.save(()=>{
            res.redirect('emailconfirm');            
        })
    }).catch((err)=>{
        //res.send(err);
        res.render('register_page',{err:err});
    })
}

exports.dashboard = async function(req,res){
    console.log("Dashboard:",req.session.user);
    let id = req.session.user.id;

    if(id)
    {
       await User.isverified(id).then(()=>{
            res.render('dashboard',{id:id});
        })
        .catch(()=>{
            res.redirect('emailconfirm');
        })        
    }
    else
    {
        res.send('Invalid id '+req.session.user);
    }
}

exports.emailconfirm_page = function(req,res){
    res.render('mailconfirm_page');        
}

exports.emailconfirm = function(req,res){
    // res.send(req.session);
    // console.log(req.session);
    let id = req.session.user.id;
    let code = req.body.code;
    if(id)
    {
        User.confirm_code(id,code).then(()=>{
            //res.send('code confirmed! ;)');
            res.redirect(`/user/${id}`);        
        }).catch((err)=>{
            //res.send('code not-confirmed! ;( '+err);
            res.render('mailconfirm_page',{err:err});
        })        
    }
    else 
    {
        res.redirect('/');
    }
}

exports.authenticateToken = function(req,res,next) {
    let token = req.session.token;
    if(token)
    {
        jwt.verify(token,process.env.SECRETKEY,(err,data)=>{
            if(err)
            {
                return res.send(err);
            }
            next();
        })
    }
    else 
    {
        res.redirect('/');
    }
}




