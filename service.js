/* eslint-disable no-param-reassign */
const request = require("./tools/request");

module.exports = {
  async search(searchStr) {
    searchStr = searchStr.replace(/ /g, "+");
    try {
      res = await request.searchRecipes(searchStr);
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


  async searchRecipesIndividual(){
    let res;
    try {
      res = await request.searchRecipesIndividual();
    } catch (err) {
      console.error("Error:", err);
    }
    return res;
  }
};
