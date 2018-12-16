var mongoose = require('mongoose');
//Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var Schema = mongoose.Schema; //schema is like a laravel migration file
//it defines the blueprint for our shopping app. 

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true}
});
//To use our schema definition, we need to convert our schema into a Model we can work with
//default: mongoose.model(modelName, schema):
//then we export it
module.exports = mongoose.model('Product', schema);