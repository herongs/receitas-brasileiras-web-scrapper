/* eslint-disable no-param-reassign */
const scrapper = require('./tools/scrapper');
const request = require('./tools/request');

module.exports = {
  async search(searchStr) {
    searchStr = searchStr.replace(/ /g, '+');
    let res;
    await request.searchRecipes(searchStr)
      .then((resp) => {
        res = scrapper.parseRecipesList(resp);
      })
      .catch((err) => err);
    return res;
  },
};
