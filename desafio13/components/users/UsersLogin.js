const Users = require('./UsersSchema');
const {Router}= require('express');
const router = Router();
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/generateToken');
const authenticateToken = require('../../utils/authenticateToken');
const UsersRegistro = require('./UsersRegistro');

module.exports = (app)  => {
    app.use('/login', router);

    router.get('/', (req, res) => {
        res.render('login');
    });

    router.post('/', async (req, res) => {
        const {email, password} = req.body;
        if(!email || !email.length) {
            res.status(401).send();
            return ;
        }
        try{
            const user = await Users.find({email: email});
            if(user.length == 0) 
                user.push({password: ''})

            const confirmPassword = await bcrypt.compare(password, user[0].password);
            if(!confirmPassword){
                console.log('Password incorrecto');
                return res.render('login-error');
            }
            const access_token = generateToken(user);
            
            return res.reder('index', {email: res.email});
            
        }catch(error){
            console.log(error);
        }
    })
}
