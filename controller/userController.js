const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login_page = function(req,res) {
    let token = req.session.token;

    jwt.verify(token,process.env.SECRETKEY,(err,data)=>{
        if(err)
        {
            res.render('login_page'); 
        }
        else
        {
            res.redirect(`/user/${req.session.user.id}`);
        }
    })
}

exports.login = function(req,res){
    

}

exports.register_page = function(req,res) {
    let token = req.session.token;

    jwt.verify(token,process.env.SECRETKEY,(err,data)=>{
        if(err)
        {
            res.render('register_page'); 
        }
        else
        {
            res.redirect(`/user/${req.session.user.id}`);
        }
    })
}

exports.register = async function(req,res) {
    let user = new User(req.body);
    //console.log(user);
    await user.register().then((data)=>{
        req.session.user = {
            id:data.insertedId.toString(),
            email:user.data.email,
        }
        let token = jwt.sign(req.session.user,process.env.SECRETKEY,{expiresIn:'30m'})
        req.session.token = token;
        req.session.save(()=>{
            res.redirect('emailconfirm');            
        })
    }).catch((err)=>{
        //res.send(err);
        res.render('register_page',{err:err});
    })
}

exports.dashboard = function(req,res){
    let id = req.session.user.id;
    console.log('dashboard:',req.session.user);
    if(id)
    {
       User.isverified(id).then(()=>{
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
    let id = req.session.user.id;
    if(id)
    {
        User.isverified(id).then(()=>{
            res.redirect(`/user/${id}`);
        })
        .catch(()=>{
            res.render('mailconfirm_page');
        })        
    }
    else
    {
        res.redirect('/');
    }
}

exports.emailconfirm = function(req,res){
    // res.send(req.session);
    // console.log(req.session);
    let id = req.session.user.id;
    let code = req.body.code;
    if(id)
    {
        User.confirm_code(id,code).then(async ()=>{
            //res.send('code confirmed! ;)');
            req.session.save(()=>{
                res.redirect(`/user/${id}`);                 
            });
        }).catch((err)=>{
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




