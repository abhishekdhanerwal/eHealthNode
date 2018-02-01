var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
    name:String,
    image:String,
    active:Boolean,
    weight:Number,
    energy:Number,
    fat:Number,
    carbohydrate:Number,
    protein:Number,
    veg:Boolean,
    nonVeg:Boolean,
    jain:Boolean,
    gluterFree:Boolean,
    halal:Boolean,
    containsGluten:Boolean,
    peanuts:Boolean,
    treeNuts:Boolean,
    celery:Boolean,
    mustards:Boolean,
    eggs:Boolean,
    containsMilk:Boolean,
    sesame:Boolean,
    fish:Boolean,
    soya:Boolean,
    sulphites:Boolean,
    lupin:Boolean,
    ingredientList:[{
        usedIngredients:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        units:Number,
        measurement:String
    }]
});

module.exports = mongoose.model('Recipe', RecipeSchema);