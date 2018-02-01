var _ = require('lodash');
var jwt = require('jwt-simple');
var multer = require('multer');
var Recipe = require('../models/Recipe');

module.exports = function (app) {

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/recipe')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    app.post('/recipe/upload', function(req, res) {

        if(verifyUser(req , res)){
            upload(req,res,function(err){
                if(err){
                    res.json({error_code:1,err_desc:err});
                    return;
                }
                // console.log(req.file.path)
                res.json({error_code:0,err_desc:null,file:req.file});
            })
        };
    });

    app.post('/recipe/create', function (req, res) {
        if(verifyUser(req, res)){
            var recipeFrmUi = req.body;
            if(!recipeFrmUi.veg)
                recipeFrmUi.veg = false;
            if(!recipeFrmUi.nonVeg)
                recipeFrmUi.nonVeg = false;
            if(!recipeFrmUi.jain)
                recipeFrmUi.jain = false;
            if(!recipeFrmUi.gluterFree)
                recipeFrmUi.gluterFree = false;
            if(!recipeFrmUi.halal)
                recipeFrmUi.halal = false;
            if(!recipeFrmUi.containsGluten)
                recipeFrmUi.containsGluten = false;
            if(!recipeFrmUi.peanuts)
                recipeFrmUi.peanuts = false;
            if(!recipeFrmUi.treeNuts)
                recipeFrmUi.treeNuts = false;
            if(!recipeFrmUi.celery)
                recipeFrmUi.celery = false;
            if(!recipeFrmUi.mustards)
                recipeFrmUi.mustards = false;
            if(!recipeFrmUi.eggs)
                recipeFrmUi.eggs = false;
            if(!recipeFrmUi.containsMilk)
                recipeFrmUi.containsMilk = false;
            if(!recipeFrmUi.sesame)
                recipeFrmUi.sesame = false;
            if(!recipeFrmUi.fish)
                recipeFrmUi.fish = false;
            if(!recipeFrmUi.soya)
                recipeFrmUi.soya = false;
            if(!recipeFrmUi.sulphites)
                recipeFrmUi.sulphites = false;
            if(!recipeFrmUi.lupin)
                recipeFrmUi.lupin = false;

            var newRecipe = new Recipe({
                name:recipeFrmUi.name,
                image:recipeFrmUi.image,
                weight:recipeFrmUi.weight,
                energy:recipeFrmUi.energy,
                fat:recipeFrmUi.fat,
                carbohydrate:recipeFrmUi.carbohydrate,
                protein:recipeFrmUi.protein,
                veg:recipeFrmUi.veg,
                nonveg:recipeFrmUi.nonveg,
                jain:recipeFrmUi.jain,
                gluterFree:recipeFrmUi.gluterFree,
                halal:recipeFrmUi.halal,
                containsGluten:recipeFrmUi.containsGluten,
                peanuts:recipeFrmUi.peanuts,
                treeNuts:recipeFrmUi.treeNuts,
                celery:recipeFrmUi.celery,
                mustards:recipeFrmUi.mustards,
                eggs:recipeFrmUi.eggs,
                containsMilk:recipeFrmUi.containsMilk,
                sesame:recipeFrmUi.sesame,
                fish:recipeFrmUi.fish,
                soya:recipeFrmUi.soya,
                sulphites:recipeFrmUi.sulphites,
                lupin:recipeFrmUi.lupin,
                active:true,
                ingredientList:recipeFrmUi.ingredientList
            })

            newRecipe.save(function (err) {
                if(err)
                    res.status(400).send({
                        message: 'Server not responding',
                        error: err
                    });
                //throw err;

                res.status(200).send({message: 'Recipe saved'});
            })
        }
    });

    app.get('/recipe/list', function (req, res) {
        if(verifyUser(req, res)){
            Recipe.find(function (err, recipes) {
                if (err) {
                    res.json({message: 'error during finding recipes', error: err});
                };
                res.json({message: 'Recipes found successfully', data: recipes});
            })
        }
    });

    app.put('/recipe/toggleStatus/:id', function (req , res) {
        if(verifyUser(req, res)){
            Recipe.findById(req.params.id, function (err, recipe) {
                if (err) {
                    res.json({message: 'error during finding recipes', error: err});
                };
                if(!recipe)
                    res.json({info: 'Recipe not found'});
                else{
                    recipe.active = !recipe.active;
                    recipe.save(function (err) {
                        if(err)
                            res.status(400).send({
                                message: 'Server not responding',
                                error: err
                            });
                        //throw err;
                        res.json({message: 'Recipe updated successfully'});
                    })
                }
            })
        }
    })

    function verifyUser(req, res) {
        var returnBoolean;
        try {
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, "secret");
        } catch (err) {
            returnBoolean = err;
            res.status(401).send({
                message: 'Token expired login again',
                error: err
            })
        }
        //payload.sub contains current user id
        if (payload && !payload.sub) {
            res.status(401).send({
                message: 'You are not Authorized'
            })
        }
        else {
            if(!returnBoolean)
                return true;
        }
    }
}