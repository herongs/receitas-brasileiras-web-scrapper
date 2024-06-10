<h1 align="center" style="font-weight: bold;">Brasilian Recipes Web Scrapper 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
    <b>This project is a web scraper developed in Node.js that collects recipes from an online recipe website. The goal is to automate the extraction of data such as ingredients, preparation method, cooking time, and other relevant information from various recipes.</b>
</p>

<h2 id="technologies">💻 Technologies</h2>

- NodeJS
- Express
- Puppeteer

<h2 id="started">🚀 Getting started</h2>

<h3>Prerequisites</h3>

Necessary requirements to run the project

- [NodeJS](https://github.com/)

<h3>Cloning</h3>

```bash
git clone https://github.com/herongs/receitas-brasileiras-web-scrapper.git
```

<h3>Starting</h3>

```bash
cd receitas-brasileiras-web-scrapper
npm install
npm start
```

<h2 id="routes">📍 API Endpoints</h2>
​
| Route                          | Description                                                               |
|--------------------------------|---------------------------------------------------------------------------|
| **GET /busca/{ingredient-name}** | Retrieves trackbacks of recipes referring to the desired ingredient. [response details](#get-auth-detail) |
| **GET /busca**                 | Retrieves all the trackbacks of recipes. [response details](#get-auth-detail) |
| **GET /receitas**              | Retrieves revenue for trackbacks that were collected. [request details](#post-auth-detail) |


Here you can list the main routes of your API, and what are their expected request bodies.
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>GET /busca/{ingredient-name}</kbd>     | retrieves trackbacks of recipes referring to the desired ingredient [response details](#get-busca-ingredientes)
| <kbd>GET /busca</kbd>     | retrieves all the trackbacks of recipes [request details](#get-busca) 
| <kbd>GET /receitas </kbd>     |  retrieves revenue for trackbacks that were collected [request details](#get-receitas) 

<h3 id="get-busca-ingredientes">GET /busca/abacate</h3>

**RESPONSE**
```json
  {
      "trackback": "/receita/molho-de-abacate-coentro"
  },
  {
      "trackback": "/receita/sanduiche-de-frango-com-abacate"
  },
```

<h3 id="get-busca">GET /busca</h3>

**RESPONSE**
```json
  {
      "trackback": "/receita/enroladinho-de-frango-ensopado-grao-de-bico-air-fryer"
  },
  {
      "trackback": "/receita/abobrinha-com-ensopado-grao-de-bico-air-fryer"
  },
```

<h3 id="receitas">GET /receitas</h3>

**RESPONSE**
```json
[
    {
        "title": "MACARRÃO GRATINADO COM ESPINAFRE",
        "trackback": "\"macarrao-gratinado-com-espinafre.json\"",
        "description": "Esta receita é um upgrade do clássico mac and cheese, o macarrão gratinado com queijo. Nesta versão, ele é preparado com um clássico europeu, o queijo francês                    mimolette, de cor laranja intensa e ligeiramente salgadinho, e espinafre. O toque final fica com a farofinha crocante.",
        "ingredients": [
            "1½ xícara (chá) de queijo francês mimolette ralado grosso",
            "1½ xícara (chá) de folha de espinafre",
            "3 xícaras (chá) de leite gelado",
            "2 colheres (sopa) de manteiga",
            "¼ de xícara (chá) de farinha de trigo",
            "½ colher (chá) de sal",
            "noz-moscada ralada na hora a gosto",
            "pimenta-do-reino moída na hora a gosto"
        ],
        "prepare_mode": [
            "Retire as folhas de espinafre dos talos, lave sob água corrente e deixe secar no escorredor enquanto prepara o molho.",
            "Numa panela média, coloque a manteiga e leve ao fogo médio para derreter. Junte a farinha e mexa bem com a espátula por 1 minuto — essa misturinha, chamada roux, serve para     
             engrossar o molho.",
            "Coloque o leite de uma só vez e mexa bem com o batedor de arame para desmanchar os gruminhos de farinha. Continue mexendo, em fogo médio, até ferver.",
            "Abaixe o fogo, tempere com o sal, noz-moscada e pimenta a gosto e deixe cozinhar por cerca de 5 minutos, mexendo de vez em quando com uma espátula, até engrossar — para verificar 
             se está no ponto, mergulhe uma colher no molho e passe o dedo indicador nas costas da colher formando uma linha: o molho não deve escorrer.",
            "Desligue o fogo, adicione o queijo e misture com a espátula até dissolver. Junte as folhas de espinafre e reserve na panela mesmo."
        ]
    }
]
```

