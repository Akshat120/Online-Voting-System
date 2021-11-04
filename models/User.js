require('dotenv').config();
const bcrypt = require('bcryptjs')
const validator = require('validator')
const nodemailer = require('nodemailer')
const usersCollection = require('../db').db().collection("users")
const ObjectId = require('mongodb').ObjectId;
let User = function(data){
    this.data = data;
    this.errors = [];
}
User.sendmail = function(toemail,code){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: 
        {
            user: 'software.engine.3@gmail.com',
            pass: process.env.EMAILPASSWORD,
        },
        from:'Confirmation Mail',

    })
    
    let template_text = `<div>
    <p>Verify your email,
     <br> 
     Security code: <b>${code}</b> 
    </p>
    </div>`;

    let mailOptions = {
        from: '"Online Voting System" <software.engine.3@gmail.com>',
        to: toemail,
        subject: 'mail confirmation',
        html: template_text,
        text: template_text,
    }

    transporter.sendMail(mailOptions, function(err, result) {
        if (err) {
            //console.log('Error ', err)
        } else {
           //console.log('Success ', result)
        }
        transporter.close()
    }) 
}
User.prototype.cleanUp = function() {
    if(typeof(this.data.email)!="string") this.data.email="";
    if(typeof(this.data.password)!="string") this.data.password="";
    if(typeof(this.data.repassword)!="string") this.data.repassword="";

    this.data = {
        email:this.data.email,
        password:this.data.password,
        repassword:this.data.repassword,
    };

}

User.prototype.validate = async function(){
    return new Promise(async (resolve,reject)=>{
        if(!validator.isEmail(this.data.email))  {this.errors.push("Must provide a valid email address!")}
        if(this.data.password == "" ) {this.errors.push("Must provide a password!")}
        if(this.data.password != this.data.repassword ) {this.errors.push("Password not-matched!")}
        
        let userExists = await usersCollection.findOne({email:this.data.email});

        if(userExists)
        {
            this.errors.push("Email Already Taken!");
        }

        resolve();
        
    })
}

User.prototype.login = async function(){
    return new Promise(async (resolve,reject)=>{
        console.log(this.data.email);
        await usersCollection.findOne({email:this.data.email}).then((data)=>{

            if(bcrypt.compareSync(this.data.password,data.password))
            {
                resolve({
                    username:data.username,
                    id:data._id,
                    email:data.email,
                });                
            }
            else
            {
                reject(['Password not-matched!']);
            }

        }).catch((err)=>{
            reject(['No user exists!']);
        })
    })
}

User.prototype.register = async function(){
    return new Promise(async (resolve,reject)=>{
        this.cleanUp();
        this.data.username = this.data.email.split('@')[0];
        await this.validate();
        
        if(!this.errors.length)
        {
            let code = Math.floor(999 + Math.random() * 1000)
            
            User.sendmail(this.data.email,code);
                       
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne({
                username:this.data.username,
                email:this.data.email,
                password:this.data.password,
                verified:false,
                code:code,
            }).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            }) 
        }
        else
        {
            reject(this.errors);
        }
    })
}


User.isverified = function(id){
    id = new ObjectId(id);
    return new Promise(async (resolve,reject)=>{
        await usersCollection.findOne({_id:id}).then((data)=>{
            if(data.verified)
            {
                resolve();
            }
            else
            {
                reject(["Not Verified!"]);
            }
        }).catch((err)=>{
            reject([err]);
        })
    })
}
User.resendcode = function(id){
    return new Promise(async (resolve,reject)=>{
        id = new ObjectId(id);
        await usersCollection.findOne({_id:id}).then(async (data)=>{
            let code = Math.floor(999 + Math.random() * 1000);
            await usersCollection.updateOne({_id:id},{$set:{code:code}}).then(()=>{
                User.sendmail(data.email,code);
                resolve();
            }).catch((err)=>{
                reject();
            })
        }).catch((err)=>{
            reject([err]);
        })         
    });
}

User.confirm_code = async function(id,code){
    return new Promise(async (resolve,reject)=>{
        id = new ObjectId(id);
        code = Number(code);
        await usersCollection.findOne({_id:id}).then(async (data)=>{
            if(data.code == code)
            {
                //resolve();
                await usersCollection.updateOne({_id:id},{ $set: {verified:true} }).then( async ()=>
                {
                    await usersCollection.updateOne({_id:id},{ $unset: { code: "" } }).then(()=>{
                        resolve();
                    })
                    .catch((err)=>{
                        reject([err]);
                    })
                }).catch((err)=>{
                    reject([err]);
                })
            }
            else
            {
                reject(["Wrong Code"]);
            }

        }).catch((err)=>{
            reject([err]);
        })        
    })
}


module.exports = User

