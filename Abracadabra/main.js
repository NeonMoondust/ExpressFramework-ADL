const express = require('express');
const app = express();

const usuarios = ['Luis','Pedro','Maria','Francisca','Karin','Alfredo','Roberto','Carlo'];

app.listen(3000, () => {console.log("Listening PORT: 3000")});

app.use(express.static("assets"));

//MiddleWare
app.use('/abracadabra/juego/:usuario', (request, response, next) => {
    if(usuarios.includes(request.params.usuario)) next();
    response.sendFile(__dirname + '/assets/who.jpeg');
});

//Routes
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/abracadabra/usuarios', (request, response) =>{
    response.send(JSON.stringify({'usuarios': usuarios}));
});

app.get('/abracadabra/conejo/:n', (request, response) => {
    const random = Math.floor(Math.random() * (5 - 1)) + 1;;
    if(random === +request.params.n) response.sendFile(__dirname + '/assets/conejito.jpg');
    response.sendFile(__dirname + '/assets/voldemort.jpg');
});


app.get('/abracadabra/juego/:usuario', (request, response, next) => {
    response.redirect('/');
});

app.get('*', (request, response) => {
    response.send('<center><h1>ERROR 404 ... Esta página no existe...”</h1></center>')
});