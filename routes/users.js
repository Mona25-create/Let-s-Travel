let User = require('../models/users').User;
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let auth = require('../controllers/auth');

router.post('/login', async(req, resp) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.find().where({email: email});
    if(user.length > 0) {
        let reasult = await bcrypt.compare(password, user[0].password)   //user is array
        if(reasult){
            let token = auth.generateToken(user[0]);
            resp.cookie('auth_token', token);  //to store token in inspect>application>cookie
            resp.send({
                redirectURL: '/admin'
            });
        }
        else{
            resp.status(400); // specific for http apis
            resp.send('Incorrect Password!');
        }
        
    }
    else{
        resp.send('Rejected');
    }
})

router.post('/register', async(req, resp) => {
    let email = req.body.email;
    let password = req.body.password;
    let rePassword = req.body.rePassword;
    let user = await User.find().where({email: email});
    if(user.length === 0) {
        let encryptedPass = await bcrypt.hash(password, 12) //async functn
        let newUser = new User({
            email: email,
            password: encryptedPass
        })
        await newUser.save();
        resp.send('Done!');
    }
    else{
        resp.send('Rejected');
    }
})

module.exports = router;