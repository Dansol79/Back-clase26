const {Router} = require('express');
const router = Router();

module.exports = (app) => {
    app.use('/login', router)

    router.get('/', (req, res) => {
        req.render('login')
    });

    router.post('/', (req, res) => {
        const name = req.body.name;
        if(!name || !name.length){
            res.status(400).send('El nombre es requerido');
            return;
        }
        req.session.name = name;
        res.redirect('/');
        console.log(req.session);
    })
}