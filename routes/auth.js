var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');


//display login page
router.get('/', function(req, res, next){    
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: ''      
    })
})

//display login page
router.get('/login', function(req, res, next){    
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: ''     
    })
})


//authenticate user
router.post('/authentication', function(req, res, next) {
      
    var email = req.body.email;
    var password = req.body.password;

        connection.query('SELECT * FROM userdetails WHERE email = ? AND password = ?', [email, password], function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Please correct enter email and Password!')
                res.redirect('/login')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                req.session.loggedin = true;
                req.session.name = rows[0].name;
                res.redirect('/home');

            }            
        })
 
})

//display login page
router.get('/register', function(req, res, next){    
    res.render('auth/register', {
        title: 'Registration Page',
        name: '',
        email: '',
        password: ''     
    })
})

// user registration
router.post('/post-register', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('password', 'Password is required').notEmpty()   //Validate password
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
    
        var user = {
            name: req.sanitize('name').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            password: req.sanitize('password').escape().trim()
        }
        
            connection.query('INSERT INTO userdetails SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    res.render('auth/register', {
                        title: 'Registration Page',
                        name: '',
                        password: '',
                        email: ''                    
                    })
                } else {                
                    req.flash('success', 'You have successfully signup!');
                    res.redirect('/login');
                }
            })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('auth/register', { 
            title: 'Registration Page',
            name: req.body.name,
            email: req.body.email,
            password: ''
        })
    }
})


//display home page
router.get('/home', function(req, res, next) {
    if (req.session.loggedin) {
        
        res.render('auth/home', {
            title:"Dashboard",
            name: req.session.name,     
        });

    } else {

        req.flash('success', 'Please login first!');
        res.redirect('/login');
    }
});

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.clearCookie('session');
  //req.flash('success', 'Login Again Here');
  res.redirect('/login');
});

module.exports = router;