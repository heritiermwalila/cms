const express = require('express');
const app =  express();
const router = express.Router();
const CategoryModel = require('../../models/Category');



router.all('/*', (req, res, next)=>{
    res.app.locals.layout = 'admin';
    next();
})


router.get('/index', (req, res)=>{
    CategoryModel.find({}).then(categories=>{

        res.render('admin/category/index', {categories:categories});
    })
});
router.get('/edit/:id', (req, res)=>{
    const categoryId = req.params.id;

    //find the category
    const category = CategoryModel.findOne({_id:categoryId}).then(category=>{
        res.render('admin/category/edit', {category:category})

    })
    
    //get all available categories
    // _exceptionCategory.find({}).then(allCategories=>{

    //     res.render('admin/category/edit', {categories:allCategories});
    // })
});

router.post('/create', (req, res)=>{
    const category = new CategoryModel();
    const errors = [];
    if(!req.body.categoryName){

        errors.push({message:'This field cannot be empty'});

        if(errors.length > 0){
            res.render('/admin/category/index', {errors:errors});
        }

    }else{

        category.categoryName = req.body.categoryName;
    
        category.save().then((categories)=>{
            req.flash('category_created', `The category ${category.categoryName} was successfully created`);
            res.redirect('/admin/category/index');
        })

    }
    
});
router.put('/update/:id', (req, res)=>{
    CategoryModel.findOne({_id:req.params.id}).then(category=>{
        category.categoryName = req.body.categoryName;
        category.save().then(updatedCategory=>{
            req.flash('category_updated', `${updatedCategory.categoryName} was updated successfully`);
            res.redirect('/admin/category/index');
        })
    })
})
router.delete('/delete/:id', (req, res)=>{
    CategoryModel.findOneAndDelete({_id:req.params.id}).then((category)=>{
        req.flash('category_deleted', `${category.categoryName} was deleted from categories list`);
        res.redirect('/admin/category/index');
        

    })
})


module.exports = router;