const express = require('express');
const app = express();
const router = express.Router();
const PostModel = require('../../models/Post');
const {isEmpty, uploadDir} = require('../../helpers/upload-files');
const fs = require('fs');
const path = require('path');
const CategoryModel = require('../../models/Category');

// router.all('/*', (req, res, next)=>{
//     res.app.locals.layout = 'admin';
//     next();
// });

router.get('/index', (req, res)=>{
    PostModel.find({})
    .populate('categoryId')
    .then(posts=>{
        res.render('admin/post/index', {posts:posts, layout:'admin'});
    }).catch(err=>{
        res.send('Something went wrong');
    })
});
router.get('/create', (req, res)=>{

    CategoryModel.find({}).then(categories=>{

        res.render('admin/post/create', {categories:categories});
    })

});
router.get('/edit/:id', (req, res)=>{

    const postId = req.params.id;
    PostModel.findOne({_id:postId}).then(post=>{

        CategoryModel.find({}).then(categories=>{
            
            res.render('admin/post/edit', {post:post, layout:'admin', categories:categories});
        })

    })

});

router.post('/create', (req, res)=>{

    //chcek if the file was upload or not

    let filename = 'placeholder.png';

    if(!isEmpty(req.files)){

        let file = req.files.postImage;
        filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename);

    }

    let allowComment = true;

    if(req.body.allowComment){
        allowComment = true;
    }else{
        allowComment = false;
    }
    //check for field before submission
    let errors = [];
    if(!req.body.postTitle){ errors.push({title:'The post title cannot be empty'})}
    if(!req.body.postContent){ errors.push({content:'The post content cannot be empty'})}
    if(errors.length > 0){
        res.render('admin/post/create', {errors:errors, layout:'admin'})
    }else{
    //insert data
    const newPost = new PostModel({
        categoryId:req.body.category,
        postTitle:req.body.postTitle,
        postStatus:req.body.postStatus,
        allowComment:allowComment,
        postContent:req.body.postContent,
        postImage:filename
    });
    newPost.save().then((data)=>{

        req.flash('success_message', `The post ${data.postTitle} was created successfully`);
        res.redirect('/admin/post/index');
    })

}
});

router.put('/edit/:id', (req, res)=>{

    //chcek if the file was upload or not

    let allowComment;

        if(req.body.allowComment){
            allowComment = true
        }else{
            allowComment = false;
        }

    PostModel.findOne({_id:req.params.id}).then(post=>{
        
        post.categoryId=req.body.category;
        post.postTitle = req.body.postTitle;
        post.postStatus = req.body.postStatus;
        post.postContent = req.body.postContent;
        post.allowComment = allowComment;
        
        
        if(!isEmpty(req.files)){

            let file = req.files.postImage;
            filename = Date.now() + '-' + file.name;
            post.postImage = filename
            file.mv('./public/uploads/' + filename);
    
        }

        post.save().then(()=>{
            req.flash('update_message', `The post ${post.postTitle} was updated successfully`);
            res.redirect(req.originalUrl);
        })

    });
});

//delete post

router.delete('/delete/:id', (req, res)=>{
    PostModel.findOneAndDelete({_id:req.params.id}).then((post)=>{

        if(post.postImage !== 'placeholder.png'){

            fs.unlink(uploadDir + post.postImage, (err)=>{
                if(err) console.log(err);
            });
        }
        req.flash('delete_message', `The post ${post.postTitle} was deleted`);
        res.redirect('/admin/post/index');
    })
})


module.exports = router;