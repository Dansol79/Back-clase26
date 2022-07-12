const express = require('express');
const moment = require('moment');
const path = require('path');
const cors = require('cors');
const {config} = require('./config/db');
const {Server: HttpServer} = require('http');
const {Server:IOServer} = require('socket.io');
const {mongodb} = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const chatController = require('./components/chat/chatController');
const normalizar = require('./normalizr');
const serverRouter = require('./routers');



// Inicializar
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


// middleware
app.use(cors(`${config.CORS}`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
serverRouter(app);


// session
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: mongodb.URL,
            mongoOptions: mongodb.options
        }),

        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 1000,
        },
        rolling: true
    })
);

// Socket.io
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    socket.emit('message', normalizar(await chatController.listAll()));

    socket.on('message', async (message) => {
        console.log('Mensaje recibido: ', message);

        const {author, text} = message;
        const newMessage ={
            author,
            text,
            fecha: moment(new Date()).format('DD/MM/YYY HH:mm:ss'),
        };
        await chatController.save({
            author: newMessage.author,
            text: newMessage.text,
            fecha: newMessage.fecha
        });
        io.socket.emit('message',newMessage);
    })
})




const server = httpServer.listen(config.PORT, () => {
    console.log(`Servidor corriendo en puerto ${config.PORT}`);
});

server.on('error', () => {
    console.log('Error en el servidor');
})