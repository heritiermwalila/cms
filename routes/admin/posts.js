const express = require('express');
const app = express();
const router = express.Router();
const PostModel = require('../../models/Post');

// router.all('/*', (req, res, next)=>{
//     res.app.locals.layout = 'admin';
//     next();
// });

router.get('/index', (req, res)=>{
    PostModel.find({}).then(posts=>{

        res.render('admin/post/index', {posts:posts, layout:'admin'});
    }).catch(err=>{
        res.send('Something went wrong');
    })
});
router.get('/create', (req, res)=>{

    res.render('admin/post/create');
});
router.get('/edit/:id', (req, res)=>{

    const postId = req.params.id;
    PostModel.findOne({_id:postId}).then(post=>{

        res.render('admin/post/edit', {post:post, layout:'admin'});
    })

});
router.post('/create', (req, res)=>{
    let allowComment = true;

    if(req.body.allowComment){
        allowComment = true;
    }else{
        allowComment = false;
    }
    const newPost = new PostModel({
        postTitle:req.body.postTitle,
        postStatus:req.body.postStatus,
        allowComment:allowComment,
        postContent:req.body.postContent,
    });
    newPost.save().then((data)=>{

        
        res.redirect('/admin/post/index');
    })
});

router.put('/edit/:id', (req, res)=>{

    let allowComment;

        if(req.body.allowComment){
            allowComment = true
        }else{
            allowComment = false;
        }

    PostModel.findOne({_id:req.params.id}).then(post=>{
        

        post.postTitle = req.body.postTitle;
        post.postStatus = req.body.postStatus;
        post.postContent = req.body.postContent;
        post.allowComment = allowComment;

        post.save().then(()=>{
            res.redirect(req.originalUrl);
        })

    });
});

//delete post

router.delete('/delete/:id', (req, res)=>{
    PostModel.findOneAndDelete({_id:req.params.id}).then(()=>{
        res.redirect('/admin/post/index');
    })
})


module.exports = router;