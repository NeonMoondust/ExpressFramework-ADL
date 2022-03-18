const express = require('express');
const hbs = require('express-handlebars');
const fs = require('fs');

const app = express();

const products = {
    'banana': 0,
    'cebollas': 0,
    'lechuga': 0,
    'papas': 0,
    'pimenton': 0,
    'tomate': 0,
}

app.listen(3000, () =>{console.log("Listening PORT: 3000")});

app.use(express.static('assets'));
app.use("/css", express.static(__dirname +"/node_modules/bootstrap/dist/css"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use(express.json());

app.set("view engine", ".hbs");


app.engine("hbs", hbs.engine({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/partials/",
    extname: ".hbs",
}));
app.get("/", (request, response) => {

    response.render("dashboard", {
        layout: "dashboard",
        products: ['banana','cebollas','lechuga','papas','pimenton','tomate'],
    });
});
app.post("/", (request, response) => {
    let body = '';
    request.on('data', chunk => {
        body += chunk;
    });
    request.on('end', async () => {
        body = JSON.parse(body);
        products[body] += 1;
        response.end('fine');
    });
    
});

app.get('/products', (request, response) => {
    response.send(JSON.stringify(products));
});
app.get('*', (request, response) =>{
    response.send('<center><h1>ERROR 404... PAGE NOT FOUND....</h1></center>')
});