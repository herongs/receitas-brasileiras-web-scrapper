/* eslint-disable no-param-reassign */
const scrapper = require("./tools/scrapper");
const request = require("./tools/request");

module.exports = {
  async search(searchStr) {
    searchStr = searchStr.replace(/ /g, "+");
    let res;

    try {
      res = await request.searchRecipes(searchStr);

      res = scrapper.parseRecipesList(resp);
    } catch (err) {
      console.error("Error:", err);
    }

    return res;
  },

  async searchAll() {
    let res;

    try {
      res = await request.searchAllRecipes();
    } catch (err) {
      console.error("Error:", err);
    }

    return res;
  },
};
