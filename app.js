const express = require('express')
const app = express()
const path = require('path')
const router = require('./router');
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly:true }
}))
app.use(cookieParser());
app.use('/',router);
module.exports = app
