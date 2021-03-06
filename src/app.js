const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not Found' });
  }

  const newRepositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = newRepositorie;

  return response.json(newRepositorie);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not Found' });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not Found' });
  }

  const newRepositorie = {
    id: repositories[repositorieIndex].id,
    title: repositories[repositorieIndex].title,
    url: repositories[repositorieIndex].url,
    techs: repositories[repositorieIndex].techs,
    likes: (repositories[repositorieIndex].likes += 1),
  };

  repositories[repositorieIndex] = newRepositorie;

  return response.json(newRepositorie);
});

module.exports = app;
