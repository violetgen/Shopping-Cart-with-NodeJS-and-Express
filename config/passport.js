var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

//the serializeUser method, tells passport how to save the user in the session
passport.serializeUser(function(user, done){
    //whenever u want to store user in the session, serialize by id:
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    //mongoose allows us to use findById
    User.findById(id, function(err, user){
        done(err, user);
    });
})
//what it means now is that, we can get the user stored in the session easily

//creating a middleware
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    //the checkBody method is from the validator package
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg); //the msg is a property to the error object
        });
        //we dont have any technical errors here, thats why the first arguemnt is null, is just validation errors we have so they will
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        //if the user already exist, error is null, the payload is false, rather flash a message to the screen
        if(user){
            return done(null, false, {message: 'Email has already been taken'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    //the checkBody method is from the validator package
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg); //the msg is a property to the error object
        });
        //we dont have any technical errors here, thats why the first arguemnt is null, is just validation errors we have so they will
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        //if the user already exist, error is null, the payload is false, rather flash a message to the screen
        if(!user){
            return done(null, false, {message: 'No user with these credentials'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    })
}))


