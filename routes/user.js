var express = require('express');
var router = express.Router();
var passport = require('passport')
var csrf = require('csurf');

var Order = require('../models/order');
var Cart = require('../models/cart');



var csrfProtection = csrf();
router.use(csrfProtection);

 //we are referencing the 'isLoggedIn' method, not executing, because we didnt add the parenthesis
 router.get('/profile', isLoggedIn, function(req, res, next){
   Order.find({user: req.user}, function(err, orders){
     if(err){
       return res.write('Error!');
     }
     var cart;
     orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
     });
      res.render('user/profile', { orders: orders});
   })
});
router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/');
});
//this targets all requests, the one with 'isLoggedIn' is placed at the top, everyother one can be accessed without loggedin
//this middleware affects all the routes below
router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });
  
  //local.signup is a strategy defined in passport.js
  router.post('/signup', passport.authenticate('local.signup', {
    // successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }), function(req, res, next){
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null; //after we have done it once, set it to null
      res.redirect(oldUrl);
    }else {
      res.redirect('/user/profile');
    }
  });
  
 
  
  router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.signin', {
    // successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }), function(req, res, next){
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null; //after we have done it once, set it to null
      res.redirect(oldUrl);
      
    }else {
      res.redirect('/user/profile');
    }
  });
 

  module.exports = router;

  //lets define  a middleware to protect our routes
  function isLoggedIn(req, res, next){
      //is authenticated is added by passport normally
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect('/');
  }

  //lets define  a middleware to protect our routes
  function notLoggedIn(req, res, next){
    //is authenticated is added by passport normally
    if(!req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}