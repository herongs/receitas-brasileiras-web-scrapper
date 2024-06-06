/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
const jsdom = require('jsdom');
const cheerio = require('cheerio');

const { JSDOM } = jsdom;
const constants = require('../route');

module.exports = {
   parseRecipesList(htmlString) {
    const $ = cheerio.load(htmlString);
  
    // Verifique se há resultados (ajuste o seletor conforme necessário)
    if ($('.no-results').length > 0) {
      return Promise.reject(new Error('Nenhuma receita encontrada'));
    }
  
    const recipes = $('.jsSearchContainer'); // Ajuste o seletor se necessário
    const maxRecipes = constants.max_recipes_returned;
    let retRecipes = [];

    console.log(recipes)
  
    recipes.each((index, element) => {

      console.log(element)
      console.log(index)

      if (index >= maxRecipes) {
        return false; // Saída antecipada se o número máximo de receitas for atingido
      }
  
      const title = $(element).find('.hitsContainer2C')

      console.log(title)

      const link = $(element).find('.link').attr('href');
  
      if (title && link) {
        const recipeId = extractRecipeID(link); // Implemente a lógica de extração
        retRecipes.push({ title, id: recipeId });
      }
    });
  
    console.log(retRecipes)

    return retRecipes;
  },

  // parseRecipesList(str) {
  //   const dom = new JSDOM(str);
  //   const doc = dom.window.document;

  //   console.log(dom)

  //   if (doc.querySelectorAll('.no-results').length > 0) {
  //     return new Promise((resolve, reject) => {
  //       reject(constants.errors.recipes_search_not_found);
  //     });
  //   }

  //   const recipes = doc.querySelectorAll('.jsSearchContainer');

  //   console.log(recipes)



  //   const maxRecipes = constants.max_recipes_returned;
  //   let retRecipes = [];
  //   for (let i = 0; i < maxRecipes; i += 1) {
  //     const titles = recipes[i].querySelectorAll('.title');
  //     const links = recipes[i].querySelectorAll('.link');

  //     if (titles.length > 0 && links.length > 0) {
  //       const title = titles[0].textContent;
  //       const link = links[0].href;

  //       retRecipes = retRecipes.concat({
  //         title: title.replace(/\n/g, ''),
  //         id: extractRecipeID(link),
  //       });
  //     }
  //   }
  //   return retRecipes;
  // },

};
