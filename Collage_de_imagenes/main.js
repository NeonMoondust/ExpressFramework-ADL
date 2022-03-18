const express = require('express');
const expFileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

app.listen(3000, () => {console.log('Listening PORT: 3000')});

app.use(express.json());

app.use(express.static('public'));
// app.use(express.static('/imgs'));

app.use(expFileUpload({
    limits: {fileSize: 5000000},
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
}));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/formulario.html');
});

app.post('/imagen', (request, response) => {
    try{
        const { target_file } = request.files;
        let { posicion } = request.body;
        if(posicion == '') posicion = 1;
        target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
            response.redirect("/imagen");
        });
    }catch(e){
        console.log(e);
        response.send(`<div style="display: grid; place-items: center;  width: 100%;
        height: 100vh;">
        <div style="display: flex; flex-direction: column;">
            <h1>Por el amor de Dios sube una imagen!! &#128545;</h1>
            <a style="display: block; margin: auto;" href="/"><button>Ahora si que la subo &#128549;</button></a>
        </div>
        </div>
        `)
    }
});

app.get('/imagen', (request, response) => {
    response.sendFile(__dirname + '/public/collage.html');
});

app.get('/deleteImg/:nombre', (request, response) => {
    const nombre = request.params.nombre;
    if(!fs.existsSync(`${__dirname}/public/imgs/${nombre}`)) console.log("This image doesn't exist");
    else fs.unlinkSync(`${__dirname}/public/imgs/${nombre}`);
    
    response.redirect('/imagen');
});