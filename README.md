<h1 align="center" style="font-weight: bold;">Brasilian Recipes Web Scrapper 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
    <b>This project is a web scraper developed in Node.js with Puppeteer to collect recipes from Panelinha.com.br. The goal is to automate the extraction of data such as ingredients, preparation method, cooking time, and other relevant information from various recipes.</b>
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

| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>GET /busca/{ingredient-name}</kbd>     | retrieves trackbacks of recipes referring to the desired ingredient [response details](#get-busca-ingredientes)
| <kbd>GET /busca</kbd>     | retrieves all the trackbacks of recipes [request details](#get-busca)
| <kbd>GET /busca-completa</kbd>     | retrieves all the trackbacks of recipes with more information [request details](#get-busca-completa) 
| <kbd>GET /receitas </kbd>     |  retrieves revenue for trackbacks that were collected [request details](#get-receitas) 
| <kbd>POST /trackbacks </kbd>     |  recovers revenue from the return of collected trackbacks [request details](#post-trackbacks) 

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

<h3 id="get-busca-completa">GET /busca-completa</h3>

**RESPONSE**
```json
    {
       "trackback":"/receita/cocotte-de-cogumelos",
       "categories":["Café da manhã","Entradas","Pratos principais","Para um","Ovo","Micro-ondas"],
       "recipe_yeld":"Até 2 porções",
       "total_time":"Pá-Pum",
       "relavance":2
     }
```

<h3 id="receitas">GET /receitas</h3>

**RESPONSE**
```json
[
    {
        "title": "MACARRÃO GRATINADO COM ESPINAFRE",
        "trackback": "\"macarrao-gratinado-com-espinafre.json\"",
        "description": "Esta receita é um upgrade do clássico mac and cheese, o macarrão gratinado com queijo. Nesta versão, ele é preparado com um clássico europeu, o queijo francês mimolette, de cor laranja intensa e                   
         ligeiramente salgadinho, e espinafre. O toque final fica com a farofinha crocante.",
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

<h3 id="post-trackbacks">POST /trackbacks</h3>

**REQUEST**
```json
{
    "trackback": "/receita/estrogonofe-para-dois"
},
```

**RESPONSE**
```json
{
    "title": "ESTROGONOFE PARA DOIS",
    "trackback": "\"estrogonofe-para-dois.json\"",
    "description": "Um estrogonofe quentinho, servido com arroz e batata palha, é daqueles pratos que fazem a gente se sentir em casa. E quem disse que ele não pode ser servido em um jantar romântico? Nesta versão, o filé mignon é 
     substituído por miolo de alcatra, e dois ingredientes especiais fazem toda a diferença: creme de leite e cogumelo-de-paris frescos.",
    "ingredients": [
        "400 g de miolo de alcatra em bifes",
        "200 g de cogumelo-de-paris",
        "1 cebola pequena",
        "1 dente de alho",
        "1 xícara (chá) de creme de leite fresco",
        "1 colher (sopa) de extrato de tomate",
        "1 colher (sopa) de ketchup",
        "1 colher (sopa) de molho inglês",
        "1 colher (sopa) de conhaque",
        "1½ colher (sopa) de azeite",
        "sal e pimenta-do-reino moída na hora a gosto"
    ],
    "prepare_mode": [
        "Corte os bifes em tirinhas (de 7 cm x 1 cm), transfira para uma tigela e mantenha em temperatura ambiente - a carne não pode estar gelada na hora de dourar. Enquanto isso, prepare os outros ingredientes.",
        "Numa tábua, corte os cogumelos-de-paris em 3 fatias e reserve (se preferir, você pode usar champignon em conserva, mas o resultado não será o mesmo). Descasque e pique fino a cebola e o alho.",
        "Leve ao fogo médio uma panela média. Quando aquecer, regue com ½ colher (sopa) de azeite, junte cerca de 1/3 da carne e deixe dourar - se colocar todas as tirinhas ao mesmo tempo, elas vão soltar o próprio líquido e cozinhar no  
         vapor em vez de dourar. Tempere com sal e pimenta-do-reino a gosto e mexa aos poucos para que dourem por igual.",
        "Transfira as tirinhas douradas para uma tigela. Doure o restante, sempre regando a panela com azeite antes de cada leva.",
        "Mantenha a panela em fogo médio e regue com mais ½ colher (sopa) de azeite. Adicione a cebola e refogue até murchar por cerca de 3 minutos, raspando bem o fundo da panela - os queimadinhos da carne são essenciais para dar sabor 
         ao preparo. Junte o alho e mexa por apenas 1 minuto para perfumar.",
        "Acrescente o extrato de tomate, o ketchup e mexa bem. Volte a carne dourada à panela, adicione o molho inglês e o conhaque. Junte os cogumelos e misture delicadamente.",
        "Regue com o creme de leite, misture e deixe cozinhar em fogo médio, mexendo de vez em quando, até o molho engrossar - isso leva cerca de 5 minutos depois que começar a ferver. Desligue o fogo, prove e acerte o sal. Sirva a 
         seguir com arroz branco e batata palha."
    ]
}
```


