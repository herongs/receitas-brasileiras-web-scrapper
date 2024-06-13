const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser')

const app = express();

app.get('/busca/:name', (req, res) => {
  service.search(req.params.name)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(err.code).json({ error: err.message });
    });

});

app.get('/busca', (req, res) => {
  service.searchAll()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(err.code).json({ error: err.message });
    });
});


app.get('/receitas', (req, res) => {
  service.searchRecipesIndividual()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(err.code).json({ error: err.message });
    });
});


app.use(bodyParser.json())
app.post('/trackbacks', (req, res) => {
  service.searchRecipesWithTrackbacks(req.body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(err.code).json({ error: err.message });
    });
});

let port = process.env.PORT;
if (port == null || port === '') {
  port = 3001;
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
