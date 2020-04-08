const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];



// GET
app.get("/repositories", (request, response) => {
    return response.json(repositories);
});



// POST
app.post("/repositories", (request, response) => {
  const {title,url, techs} = request.body;
  const repositorie = {id:uuid(), title, url, techs, likes:0};

  // Validar o Uuid
  if (!isUuid(repositorie.id)) {
    return response.status(400).json({error: "Invalid project ID!"})
  }

  // Adicionar
  repositories.push(repositorie);
  return response.json(repositorie);
});



app.put("/repositories/:id", (request, response) => {

  const {id} = request.params;
  const {url, title, techs} = request.body;
  
  // Buscar index do repositorio
  const index = repositories.findIndex(repositorie => repositorie.id === id); 
  if (index < 0) {
      return response.status(400).json( {error: 'Repositorie not found!'})
  }

  // Alterar o objeto 
  repositories[index]['url']   = url;
  repositories[index]['title'] = title;
  repositories[index]['techs'] = techs;

  return response.json(repositories[index]);
});


// DELETE
app.delete("/repositories/:id", (req, res) => {
    const {id} = req.params;

    // Buscar index do repositorio
    const index = repositories.findIndex(repositorie => repositorie.id === id); 
    if (index < 0) {
        return res.status(400).json( {error: 'Repositorie not found!'})
    }

    // Remover o repositorio, neste index
    repositories.splice(index, 1);
    return res.status(204).send();
});


// POST de LIKES
app.post("/repositories/:id/like", (request, res) => {
  const {id} = request.params;
  
  // Buscar index do repositorio
  const index = repositories.findIndex(repositorie => repositorie.id === id); 
  if (index < 0) {
      return res.status(400).json( {error: 'Repositorie not found!'})
  }

  // Alterar o objeto 
  repositories[index]['likes'] += 1;
  return res.json(repositories[index]);

});

module.exports = app;
