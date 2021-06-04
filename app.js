//npm init -y    for installing package.json
//npm i express  for  installing express
//npm i mongoose for ...node 
//npm i multer
//npm i bcrypt for security purpose
//npm i jsonwebtoken for generating unique key for logged in users
//npm i cookie-parser for accessing cookie's info token etc.
let express = require('express');
let app = express();
let mongoose = require('mongoose');
app.use(express.json());
let multer = require('multer');
let postsRouter = require('./routes/posts');
let callbackRequestsRouter = require('./routes/callback-requests');
let emailsRouter = require('./routes/emails');
let Post = require('./models/posts').Post;
let userRouter = require('./routes/users');
let cookieParser = require('cookie-parser');
let auth = require('./controllers/auth');

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/travels', {useNewUrlParser: true}, { useUnifiedTopology: true });
let imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/image3'),
    filename: (req, file, cb) => cb(null, file.originalname)
})

app.use(multer({storage: imageStorage}).single('imageFile'));
app.use(cookieParser());  //used for every request
/*
let post1 = new Post({
    id: 2,
    title: 'Statue of liberty',
    date: new Date(),
    description: 'some description',
    text: 'some text',
    country: 'USA',
    imageURL: '/images/1.jpg'
});

post1.save();
*/
app.use(express.static('public'));

app.use('/posts', postsRouter);
app.use('/callback-requests', callbackRequestsRouter);
app.use('/emails', emailsRouter);
app.use('/users', userRouter);

app.get('/sight', async (req, resp) => {
    let id = req.query.id;
    let post = await Post.findOne({id: id});
    resp.render('sight', {
        title: post.title,
        imageURL: post.imageURL,
        date: post.date,
        text: post.text
    })
})

app.get('/admin', (req, resp) => {
    let token = req.cookies['auth_token'];
    if(token && auth.checkToken(token)){
        resp.render('admin');
    }
    else{
        resp.redirect('/login');
    }
    
})

app.get('/login', (req, resp) => {
    resp.render('login');
})
app.listen(3000, () => console.log("listening 3000........"));