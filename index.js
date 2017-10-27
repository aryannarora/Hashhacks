var express=require('express');
var app=express();
var port=5000;

app.listen(port,function(err){
	console.log('system running on Port: ',port );
});


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: 'hashhacks',
					resave:false,
					saveUninitialized:false
					
					}));
require('./src/config/passport')(app);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', './src/views');

var userrouter= express.Router();
