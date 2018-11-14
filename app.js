const express = require('express');
const {mongodbUrl} = require('./config/config');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const expressHanlebars = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(fileUpload());

//database connection
mongoose.connect(mongodbUrl, {useNewUrlParser:true}).then(db=>{

console.log(`You're connected to the database`);

}).catch(err=>{
    console.log(`could not connect error: ${err}`)
})

//serve static file and join app with public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
//handlebars settings and options
const {select, dateFormat} = require('./helpers/handlebars-helpers');
app.engine('handlebars', expressHanlebars({defaultLayout:'home', helpers:{select:select, dateFormat:dateFormat}}));

app.set('view engine', 'handlebars');

//session and flash

app.use(session({
    secret:'cmsblogsystem',
    resave:true,
    saveUninitialized:true
}));
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//make a success message variable locally to be accessible everywhere
app.use((req, res, next)=>{
    app.locals = {
        user:req.user || null,
        success_message:req.flash('success_message'),
        delete_message:req.flash('delete_message'),
        update_message:req.flash('update_message'),
        category_created:req.flash('category_created'),
        category_deleted:req.flash('category_deleted'),
        category_updated:req.flash('category_updated'),
        register_user:req.flash('register_user'),
        email_exist:req.flash('email_exist'),
        error:req.flash('error')
    }
    
    next();
})

//load router
const homeRoutes = require('./routes/home/index');
const adminRoutes = require('./routes/admin/index');
const postsRoutes = require('./routes/admin/posts');
const categoriesRoutes = require('./routes/admin/categories');
const commentsRoutes = require('./routes/admin/comments');

app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/post', postsRoutes);
app.use('/admin/category', categoriesRoutes);
app.use('/admin/comment', commentsRoutes);



const port = 5500 || process.env.PORT;
app.listen(port, ()=>{
    console.log(`Your server is running on port: ${port}`);
});