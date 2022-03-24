//Perdon John ta feo :(

const express = require('express');
const {Pool} = require('pg');

const PSQL_CONFIG = {
    user: "cristobal",
    host: "localhost",
    password: "desafio",
    database: "cursos",
    port: 5432,
};

let pool;
let client = [], available_clients = [];
let client_id = 0;

const app = express();

app.listen(3000, () => {console.log('Listening PORT: 3000')});

app.use(express.json());

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/cursos', async (request, response) => {
    let result;
    let current_client;
    try {
        pool = new Pool(PSQL_CONFIG);
        current_client = await clientHandler('create', 0);
        result = await client[current_client].query(`SELECT * FROM cursos;`);
    } catch (e) {
        console.log(e);
        response.status(500).send('Something went wrong :(');
    }finally{
        clientHandler('release', current_client);
    }
    response.status(200).send(result.rows);
});

/*
    nombre
    nivelTecnico
    fechaInicio
    duracion
*/
app.post('/curso', async (request, response) => {
    let curso = JSON.parse(JSON.stringify(request.body));
    let current_client;
    try {
        pool = new Pool(PSQL_CONFIG);
        current_client = await clientHandler('create', 0);
        await client[current_client].query(`INSERT INTO cursos (nombre, nivel, fecha, duracion) values ('${curso.nombre}', ${+curso.nivelTecnico}, '${curso.fechaInicio}', ${+curso.duracion})`);
    } catch (e) {
        console.log(e);
        response.status(500).send('Something went wrong :(');
    }finally{
        clientHandler('release', current_client);
    }
    response.sendStatus(200);
});

app.put('/curso', async (request, response) => {
    let curso = JSON.parse(JSON.stringify(request.body));
    let current_client;
    if(isNaN(+curso.id)) return response.send('Bad Request 400');
    try {
        pool = new Pool(PSQL_CONFIG);
        current_client = await clientHandler('create', 0);
        await client[current_client].query(`UPDATE cursos SET nombre='${curso.nombre}', nivel=${+curso.nivelTecnico}, fecha='${curso.fechaInicio}', duracion=${curso.duracion} WHERE id=${+curso.id}`);
    } catch (e) {
        console.log(e);
        response.status(500).send('Something went wrong :(');
    }finally{
        clientHandler('release', current_client);
    }
    response.sendStatus(200);
});


app.delete('/curso/:id', async (request, response) => {
    let curso = request.params.id;
    let current_client;
    try {
        pool = new Pool(PSQL_CONFIG);
        current_client = await clientHandler('create', 0);
        await client[current_client].query(`DELETE FROM cursos WHERE id=${+curso}`);
    } catch (e) {
        console.log(e);
        response.status(500).send('Something went wrong :(');
    }finally{
        clientHandler('release', current_client);
    }
    response.sendStatus(200);
});

async function clientHandler(method, current_client){
    switch (method) {
        case 'create':
            let new_client = await pool.connect();
            if(available_clients.length > 0){
                client[available_clients[0]] = new_client;
                return available_clients.shift();
            }
            client.push(new_client);
            return client_id++;
        case 'release':
            client[current_client].release();
            available_clients.push(current_client);
            break;
        default:
            break;
    }
}