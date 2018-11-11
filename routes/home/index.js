const express = require('express');
const router = express.Router();
const PostModel = require('../../models/Post');
const CategoryModel = require('../../models/Category');

router.all('/*', (req, res, next)=>{
    res.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res)=>{

    PostModel.find({}).then(posts=>{
        CategoryModel.find({}).then(categories=>{

            res.render('home/index', {posts:posts, categories:categories});
        });

    });
});

router.get('/single/:id', (req, res)=>{
    PostModel.findOne({_id:req.params.id}).then(post=>{

        CategoryModel.find({}).then(categories=>{

            res.render('home/single', {post:post, categories:categories});
        })
        
    })
})

router.get('/about', (req, res)=>{
    res.render('home/about')
});
router.get('/register', (req, res)=>{
    res.render('home/register')
});
router.get('/login', (req, res)=>{
    res.render('home/login')
});


module.exports = router;