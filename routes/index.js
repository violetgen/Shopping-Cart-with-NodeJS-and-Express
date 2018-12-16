var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');

var Cart = require('../models/cart');



// var csrfProtection = csrf();
// router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  // var products = Product.find(); //this is not async. we will refactor like:
  Product.find(function(err, docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0; i < docs.length; i += chunkSize){
      //slice: give us only 3, e.g, starting from 0 to 0+3
        productChunks.push(docs.slice(i, i+chunkSize))
    }
    res.render('shop/index', { title: 'Express', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
  });
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id
  //if we already have stuffs in the cart, give us, else, give us an empty object
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {product: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0]; //get the first item in the array
    res.render('shop/checkout', {totalPrice: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next){

    if(!req.session.cart){
      return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")("sk_test_b0vcPuDxwvGGgVSysfis6vVQ");

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    // source: req.body.stripeToken, // obtained with Stripe.js
    source: "tok_mastercard",
    description: "Test charge"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success', 'Successfully bought product');
      req.session.cart = null; //clear the cart
      res.redirect('/');
    })
   
  });
})

//lets define  a middleware to protect our routes
function isLoggedIn(req, res, next){
  //is authenticated is added by passport normally
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;

  res.redirect('/user/signin');
}


module.exports = router;
