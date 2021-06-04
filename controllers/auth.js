let jwt = require('jsonwebtoken');
let secret = 'adsds55s';

function generateToken(user) {
    let payload = {
        email: user.email,
        password: user.password
    }
       //how data encrypted set bydefault 2nd argue-object payload to generate unique sequence of letter and number  3rd arg- secret key

       return jwt.sign(payload, secret);
}

function checkToken(token){
    return jwt.verify(token, secret);
}

module.exports = { generateToken, checkToken };