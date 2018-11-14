const express = require('express');
const app = express();
const router = express.Router();
const CommentModel = require('../../models/Comment');
const PostModel = require('../../models/Post');

router.all('/*', (req, res, next)=>{
    
    res.app.locals.layouts = 'admin';
    next();
});

router.get('/index', (req, res)=>{

    CommentModel.find({}).populate('postId')
    .then((comments)=>{
        
        res.render('admin/comment/index', {comments:comments})
    })

})

router.put('/approve/:id', (req, res)=>{
    CommentModel.findOne({_id:req.params.id}).then(comment=>{
        comment.approve = true;
        comment.save().then(()=>{
            res.redirect('back');
        })
    })
})

router.put('/desapprove/:id', (req, res)=>{
    CommentModel.findOne({_id:req.params.id}).then(comment=>{
        comment.approve = false;
        comment.save().then(()=>{
            res.redirect('back');
        })
    })
});

router.delete('/delete/:id', (req, res)=>{
    CommentModel.findOne({_id:req.params.id}).then(comment=>{
        if(comment.approve === false){
            PostModel.findOne({CommentsIds:comment._id}).then(commentId=>{

                const commentToBeRemoved = commentId.CommentsIds;
                const indexOfComment = commentToBeRemoved.indexOf(comment._id);

                if(indexOfComment !== -1){
                    commentToBeRemoved.splice(indexOfComment, 1);
                    commentId.save().then(()=>{

                        comment.remove().then(()=>{

                        req.flash('comment_deleted', 'Comment was deleted successfully');
                        res.redirect('back');
                        })
                    })
                }

              

            })
            
        }else{
            req.flash('cannot_delete_comment', 'Cannot remove the comment if is not yet desapproved');
            res.redirect('back');
        }
        
    })
})


module.exports = router;