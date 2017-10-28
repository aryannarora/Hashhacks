var express=require('express');
var app=express();
var port=5000;
var mongodb = require('mongodb').MongoClient;
request = require('request');

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

app.use(express.static('public'));
require('./src/config/passport')(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', './src/views');
app.set('view engine', 'ejs');

var userrouter= express.Router();
var authRouter= express.Router();

app.get('/signup',function(req,res){
	res.render('sign-up');
})

app.get('/login',function(req,res){
	res.render('login');
})

app.get('/',function(req,res){
	res.render('frontpage');
});

app.use('/auth', authRouter);

app.use('/user', userrouter);

authRouter.route('/signin')
	.post(passport.authenticate('local', {
	    failureRedirect: '/login'
	}), function (req, res) {
		
	    res.redirect('/user/dashboard');
	});


 authRouter.route('/register')
        .post(function (req, res) {
        	
            var url =
                'mongodb://localhost:27017/hhusers';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                var user = {
                    _id: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    phone: req.body.phone,
                    address:req.body.add,
                    city:req.body.city,
                    zip:req.body.zip,
                    state:req.body.state,
                    hash:" "
                };
                collection.findOne({
                	_id: user._id
                },function(err , results){
                	if(results===null)
                	{	

                		 collection.insert(user,
                    function (err, results) {
                    	request
					  .get('http://localhost:8000/add/?timestamp=0210247&email='+user._id+'&lat=150.3&long=12.33&energy='+(Math.random()*99+1)+'&unit='+(Math.random()*15+5))
					  .on('response', function(response) {
					    // console.log(response.statusCode) // 200
					    // console.log(response.headers['content-type']) // 'image/png'
					    db.users.update({_id:user._id},
					    	$set={
					    		hash:response.hash

					    })
					  });

                        req.login(results.ops[0], function () {
                        	res.redirect('/user/dashboard');

                        });
                    });
                	}
                	else
                	 {	
                	res.redirect('/signup');       



                	
                	}
                })
               
            });
           });


authRouter.use(function(req,res,next){
	if(!req.user){
		return res.redirect('/login');		
	}
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  	next();
});

userrouter.use(function(req,res,next){
	if(!req.user){
		return res.redirect('/login');		
	}
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  	next();
});

userrouter.route('/dashboard')
    .get(function (req, res) {

    	 res.render('bs',{
    	 	id:req.user._id
        	
        });
    });






 
