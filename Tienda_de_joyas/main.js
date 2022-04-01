const express = require('express');
const {results} = require('./data/joyas.js');

let joyas = results;
const MAX_JEWELS_TO_SHOW = 5;
const app = express();

app.listen(3000, () => console.log('Listening PORT: 3000'));

function data_v1(){
  return joyas.map((joya) => {
    console.log(joya);
    return {
      name: joya.name,
      ref_link: `http://localhost:3000/api/v1/joyas/${joya.id}`,
    };
  });
}

function data_v2(){
  return joyas.map((joya) => {
    return {
      jewel: joya.name,
      source: `http://localhost:3000/api/v2/joyas/${joya.id}`,
    };
  });
}

function getJewel(id){
  return joyas.find((element) => element.id == id);
}

function getFields(jewel, fields){
  const object_to_return = new Object();
  object_to_return.id = jewel.id;
  fields.split(',').forEach(field => {
    if(Object.keys(jewel).includes(field)) object_to_return[field] = jewel[field];
    else object_to_return[field.toString()] = null;
  })
  return object_to_return;
}

function sortJewel(order){
  let jewels;
  switch(order){
    case "asc": jewels = joyas.sort((a,b) => a.value > b.value ? 1 : -1);
                break;
    case "desc": jewels = joyas.sort((a,b) => a.value < b.value ? 1 : -1);
                break;
    default: break;
  }
  return jewels;
}

app.get('/api/v1/joyas', async (require, response) => {
  const {page, values} = require.query;
  const all_data = values ? data_v1(sortJewel(values)): data_v1();

  response.send({
    joyas: page && (page > 0 && page <= Math.ceil(all_data.length/MAX_JEWELS_TO_SHOW)) ? all_data.slice(page * MAX_JEWELS_TO_SHOW - MAX_JEWELS_TO_SHOW, page * MAX_JEWELS_TO_SHOW) : all_data ,
  });
});

app.get("/api/v2/joyas", (require, response) => {
  const {page, values} = require.query;
  const all_data = values ?  data_v2(sortJewel(values)) : data_v2();

  response.send({
    joyas: page && (page > 0 && page <= Math.ceil(all_data.length/MAX_JEWELS_TO_SHOW)) ? all_data.slice(page * MAX_JEWELS_TO_SHOW - MAX_JEWELS_TO_SHOW, page * MAX_JEWELS_TO_SHOW) : all_data ,
  });
});

app.get("/api/v1/joyas/:id", (require, response) => {
  const id = require.params.id;
  const { fields } = require.query;
  const jewel = getJewel(id);
  jewel ? response.send(!fields ? jewel : getFields(jewel, fields)):
          response.status(404).send({
            error: "404 Not Found",
            message: "No existe una guitarra con ese ID",
          });
});

app.get("/api/v2/joyas/:id", (require, response) => {
  const id = require.params.id;
  const { fields } = require.query;
  const jewel = getJewel(id);

  jewel ? response.send(!fields ? jewel : getFields(jewel, fields)):
            response.status(404).send({
              error: "404 Not Found",
              message: "No existe una guitarra con ese ID",
            });
});

app.get("/api/v2/joyas/category/:type", (require, response) => {
  const category_type = require.params.type;
  const filtered_jewels = joyas.filter(element => element.category === category_type)

  response.send({
    "cantidades": filtered_jewels.length,
    "categorias": joyas.map(element => {
                  return element.category;
    }).filter((element, index, this_array) => this_array.indexOf(element) == index),
    "joyas": filtered_jewels.map(element => {
                  return {
                    jewel: element.name,
                    source: `http://localhost:3000/api/v2/joyas/${element.id}`,
                  };
                })
              }
  );
});
