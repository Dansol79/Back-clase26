const productTestController = require('../components/productTest/ProductTestController');
const UsersRegistro = require('../components/users/UsersRegistro');
const UsersLogin = require('../components/users/UsersLogin');
const isLoggedIn = require('../utils/isLoggedIn');
const authenticateToken = require('../utils/authenticateToken')

let user= '';

module.exports = (app) => {
    productTestController(app);
    UsersRegistro(app);
    UsersLogin(app);

    app.get('/auth', authenticateToken, (req, res) => {
        user = req.user;
        console.log(user);
        res.send('usario autenticado');
    });

    app.get('/', (req, res) => {
        if(user === ''){
           return res.redirect('login')
        }
        res.render('index', {email: user[0].email})
    });

    app.get('/logoout', (req, res) => {
        res.render('logout')
    });

    app.get('*', (req, res) => {
        res.status(404).json({
            error: -2,
            description: 'Pagina no encontrada'
        })
    });
};
