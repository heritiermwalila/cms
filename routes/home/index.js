const express = require('express');
const app = express();
const router = express.Router();
const PostModel = require('../../models/Post');
const CategoryModel = require('../../models/Category');
const UserModel = require('../../models/User');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LacalStrategy = require('passport-local').Strategy;
const CommentModel = require('../../models/Comment');



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
router.post('/register', (req, res)=>{
    const errors = [];
    
    if(req.body.password !== req.body.passwordConfirm){
        errors.push({donotmatch:'Password do not match, please try again'});
    }
    if(!req.body.firstName){
        errors.push({firstRequired:'Firstname field is required'});
    }
    if(!req.body.emailAddress){
        errors.push({emailRequired:'Email field is required'});
    }
  

    if(errors.length > 0){
        res.render('home/register', {errors:errors, firstName:req.body.firstName, lastName:req.body.lastName, emailAddress:req.body.emailAddress})
    }else{
        
          //check if the email exist in the database
          UserModel.findOne({emailAddress:req.body.emailAddress}).then((user=>{
              if(!user){

                const newUser = new UserModel({
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    emailAddress:req.body.emailAddress,
                    password:req.body.password
            
                });

                bcryptjs.genSalt(10, (err, salt)=>{
                    bcryptjs.hash(newUser.password, salt, (err, hash)=>{
        
                        newUser.password = hash;
        
                        newUser.save().then((user)=>{
                        req.flash('register_user', `Dear ${user.firstName} thank joining us please login now to your account`);
                        res.redirect('/login')
                        })
        
                    })
                })
                
            }else{     
                req.flash('email_exist', `${req.body.emailAddress} already exist please try to login`);
                res.redirect('/login')
              }
          }))    
    }

})

router.post('/login', (req, res, next)=>{

    passport.use(new LacalStrategy({

        usernameField:'email'

    }, (email, password, done)=>{
        UserModel.findOne({emailAddress:email}).then((user=>{
            if(!user) return done(null, false, {message:'No user was found'});

            bcryptjs.compare(password, user.password, (err, matched)=>{
                if(matched){
                    return done(null, user)
                }else{
                    return done(null, false, {message:'Incorrect password'});
                }
            })
        }))
    }))

    passport.authenticate('local', {
        successRedirect:'/admin',
        failureRedirect:'/login',
        failureFlash:true
    })(req, res, next);

    //serialize user data and save it in a session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        UserModel.findById(id, function(err, user) {
          done(err, user);
        });
      });
    
});

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
  });

router.post('/comment/:id', (req, res)=>{
    const postId = req.params.id;
    
    
    //comment option for logged user
    if(req.user){
        UserModel.findOne({_id:req.user.id}).then(userInfo=>{

            const commentUserLoggedIn = new CommentModel({
                fullName:userInfo.firstName + ' ' + userInfo.lastName,
                userEmail:userInfo.emailAddress,
                commentBody:req.body.commentBody,
                postId:postId,
            });

            commentUserLoggedIn.save().then((comment=>{
        
                PostModel.findOne({_id:comment.postId}).then((post)=>{
        
                    post.CommentsIds.push(comment._id);
                    
                   post.save().then(()=>{
                       res.redirect('back');
                   })
                })
            }))
            
        })
    }else{
            const comment = new CommentModel({
                fullName:req.body.fullName,
                userEmail:req.body.userEmail,
                commentBody:req.body.commentBody,
                postId:postId,
            })

            comment.save().then((comment=>{
        
                PostModel.findOne({_id:comment.postId}).then((post)=>{
        
                    post.CommentsIds.push(comment._id);
                    
                   post.save().then(()=>{
                       res.redirect('back');
                   })
                })
            }))
    }
    
        
})


module.exports = router;