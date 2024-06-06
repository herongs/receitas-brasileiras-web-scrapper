/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
const fs = require('fs');

module.exports = {
  parseRecipesList(response) {
    try {
      const responseObject = JSON.parse(response);

      if (responseObject.results && responseObject.results.length > 0 && responseObject.results[0].hits) {
        const hits = responseObject.results[0].hits

        const receitas = [];
        hits.forEach((hit) => {
          const receita = {
            title: hit.document.title,
            description: hit.document.description,
            ingredients: hit.document.ingredients,
            trackback: hit.document.trackback,
          };
          receitas.push(receita);
        });

        const json = JSON.stringify(receitas);
        fs.writeFileSync('receitas.json', json);

        return hits;
      } else {
        console.error('Estrutura de resposta inválida:', responseObject);
        return [];
      }
    } catch (error) {
      console.error('Erro ao analisar resposta:', error);
      return [];
    }
  }

};
