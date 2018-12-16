var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true });

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'This is an awesome game to play',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Ade Video Game',
        description: 'This is an awesome game to play',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'John Video Game',
        description: 'This is an awesome game to play',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'MArk Video Game',
        description: 'This is an awesome game to play',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'This is an awesome game to play',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Wendy Video Game',
        description: 'This is an awesome game to play',
        price: 30
    }),
];
var done =0;
for(i=0; i<products.length; i++){
    products[i].save(function(err, result){
        done++; //we increment first, since array start with the index of zero, and below we want to check the length
        //if we dont increase first our arg for the 'if' statement below will be: 4 === 5, which is not what we want
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect()
}

//since saving in the database is async, we cant just call disconnect, because we might disconnect when some stuffs have not been saved, we would rather pass a callback to the above save method
// mongoose.disconnect()