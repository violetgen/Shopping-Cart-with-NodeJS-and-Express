const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    'email' : {type: String, required: true},
    'password' : {type: String, required: true}
});

//lets add a method to the userSchema
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
};
userSchema.methods.validPassword = function(password){
    //this.password is the auth user password
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema)