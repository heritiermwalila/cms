const express = require('express');
const app = express();
const route = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/login-helper');



route.all('/*', (req, res, next)=>{
    res.app.locals.layout = 'admin';
    next();
});

route.get('/', (req, res)=>{
        res.render('admin/index');
});

route.post('/generate-fake-data', (req, res)=>{

      for(let i = 0; i < req.body.amount; i++){
              let post = new Post();

              post.postTitle = faker.name.title();
              post.postStatus = 'public';
              post.postContent = faker.lorem.sentences();
              post.allowComment = faker.random.boolean();

              post.save().then(()=>{
                     
              })
      }
      res.redirect('/admin/post/index');

})



module.exports = route;