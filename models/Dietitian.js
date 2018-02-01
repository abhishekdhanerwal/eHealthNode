var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userRole = require('../enums/user_role');

var Coupon = require('../models/Coupon');

var DietitianSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    profilePic:String,
    email:{
        type:String,
        lowercase: true,
        required:true
    },
    mobile:{
        type:String,
        maxlength:10,
        minlength:10,
        required:true
    },
    role:{
        type:String,
        enum:userRole.module.role,
        required:true
    },
    description:{
        type:String
    },
    state:{
        type:String,
        uppercase: true
    },
    city:{
        type:String,
        lowercase: true
    },
    pinCode:{
        type:Number
    },
    price:{
        type:Number
    },
    active:{
        type:Boolean
    },
    discount: [{
        discountPercentage: Number,
        discountFixed: Number,
        discountPrice: Number,
        couponId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon'
        }
    }],
    password: {
        type:String,
        required:true
    }
});

DietitianSchema.pre('save', function (next) {

    var user = this;
    //check if password is modified
    if(!user.isModified('password'))
        return next();

    bcrypt.genSalt(10, function (err, salt) {
        if(err)
            return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if(err)
                return next(err);

            user.password = hash;
            next();
        })
    })
});

DietitianSchema.methods.toJson = function () {
    var user = this.toObject();
    delete user.password;

    return user;
};

DietitianSchema.methods.comparePassword = function (password , callback) {
    console.log(password)
    console.log(this.password)
    bcrypt.compare(password , this.password, callback)
};

module.exports = mongoose.model('Dietitian', DietitianSchema);