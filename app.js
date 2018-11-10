const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const expressHanlebars = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');




//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(fileUpload());

//database connection
mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser:true}).then(db=>{

console.log(`You're connected to the database`);

}).catch(err=>{
    console.log(`could not connect error: ${err}`)
})

//serve static file and join app with public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
//handlebars settings and options
const {select} = require('./helpers/handlebars-helpers');
app.engine('handlebars', expressHanlebars({defaultLayout:'home', helpers:{select:select}}));

app.set('view engine', 'handlebars');

//session and flash

app.use(session({
    secret:'cmsblogsystem',
    resave:true,
    saveUninitialized:true
}));
app.use(flash());

//make a success message variable locally to be accessible everywhere
app.use((req, res, next)=>{
    app.locals.success_message = req.flash('success_message');
    next();
})

//load router
const homeRoutes = require('./routes/home/index');
const adminRoutes = require('./routes/admin/index');
const postsRoutes = require('./routes/admin/posts');
app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/post', postsRoutes);


const port = 5500 || process.env.PORT;
app.listen(port, ()=>{
    console.log(`Your server is running on port: ${port}`);
});