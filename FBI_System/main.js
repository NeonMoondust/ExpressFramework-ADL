const express = require('express');
const jwt = require('jsonwebtoken');

const {results} = require('./data/agentes.js');

const app = express();

const secretKey = 'something'
app.listen(3000, () => {console.log('Listening PORT: 3000')});

app.get('/', (require, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/SignIn', (require, response) => {
    const {email, password} = require.query;
    const agent = results.find((a) => a.email == email && a.password == password);

    if (agent) {
        const token = jwt.sign({
                                    exp: Math.floor(Date.now() / 1000) + 120,
                                    data: agent,
                                }, secretKey);
    response.send(`
    <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
    Bienvenido, ${email}.
    <script>
    sessionStorage.setItem('token', JSON.stringify("${token}"))
    </script>`);
    } else {
        response.send("Usuario o contraseña incorrecta");
    }
});

app.get("/Dashboard", (require, response) => {
    let { token } = require.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        err ? response.status(401).send({
                                    error: "401 Unauthorized",
                                    message: err.message,
                                    }) : response.send(`Bienvenido al Dashboard ${decoded.data.email}`);
                                });
});