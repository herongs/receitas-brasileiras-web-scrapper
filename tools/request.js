/* eslint-disable no-return-assign */
/* eslint-disable global-require */
const constants = require("../route");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

module.exports = {
  async searchRecipes(parametro) {
    let totalPages = null;
    const allTrackbacks = [];

    try {
      if (!totalPages) {
        console.log("Getting total pages");
        const url = `${constants.tg_base_url}/busca?query=${parametro}&page=1&configure%5BhitsPerPage%5D=20`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        let lastInterceptedBody = null;

        page.on("request", (request) => {
          if (
            request.resourceType() === "xhr" ||
            request.resourceType() === "fetch"
          ) {
            console.log(`Intercepted request to: ${request.url()}`);
          }
          request.continue();
        });

        page.on("response", async (response) => {
          if (response.request().url().includes("/multi_search")) {
            try {
              const body = await response.text();
              lastInterceptedBody = body;
            } catch (error) {
              console.error(`Error reading response body: ${error}`);
            }
          }
        });

        await page.goto(url);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let parseLastInterceptedBody = JSON.parse(lastInterceptedBody);

        if (
          parseLastInterceptedBody.results &&
          parseLastInterceptedBody.results.length > 0 &&
          parseLastInterceptedBody.results[0].found
        ) {
          totalPages = Math.floor(
            parseLastInterceptedBody.results[0].found / 12
          );
          let resto = parseLastInterceptedBody.results[0].found % 12;
          if (resto > 0) {
            totalPages += 1;
          }
        }

        await browser.close();
      }

      if (!totalPages) {
        totalPages = 1;
      }

      for (let searchPage = 1; searchPage <= totalPages; searchPage++) {
        console.log(`Starting page ${searchPage}`);

        const url = `${constants.tg_base_url}/busca?query=${parametro}&page=${searchPage}&configure%5BhitsPerPage%5D=20`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        let lastInterceptedBody = null;

        page.on("request", (request) => {
          if (
            request.resourceType() === "xhr" ||
            request.resourceType() === "fetch"
          ) {
            console.log(`Intercepted request to: ${request.url()}`);
          }
          request.continue();
        });

        page.on("response", async (response) => {
          if (response.request().url().includes("/multi_search")) {
            try {
              const body = await response.text();
              lastInterceptedBody = body;
            } catch (error) {
              console.error(`Error reading response body: ${error}`);
            }
          }
        });

        await page.goto(url);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await browser.close();

        let parseLastInterceptedBody = JSON.parse(lastInterceptedBody);

        if (
          parseLastInterceptedBody.results &&
          parseLastInterceptedBody.results.length > 0 &&
          parseLastInterceptedBody.results[0].hits
        ) {
          const hits = parseLastInterceptedBody.results[0].hits;

          hits.forEach((hit) => {
            const recipe = {
              trackback: hit.document.trackback,
            };

            if (recipe.trackback.startsWith("/receita")) {
              allTrackbacks.push(recipe);
            }
          });
        } else {
          console.error("Invalid structure:", responseObject);
        }

        console.log(`Page ${searchPage} done`);
      }

      console.log("Size of allTrackbacks:", allTrackbacks.length);
      console.log("All pages done");
    } catch (error) {
      console.log("Error occurred:", error);
    } finally {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const filename = `trackbacks_${parametro}_${timestamp}.json`;
      const folderPath = path.join(__dirname, "..", "trackbacks");
      const filePath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, JSON.stringify(allTrackbacks));

      console.log("Data saved to:", filename);
    }

    return allTrackbacks;
  },

  async searchAllRecipes() {
    const totalPages = 210;
    const allTrackbacks = [];

    try {
      for (let searchPage = 1; searchPage <= totalPages; searchPage++) {
        console.log(`Starting page ${searchPage}`);

        const url = `${constants.tg_base_url}/busca?query=&page=${searchPage}&configure%5BhitsPerPage%5D=20`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        let lastInterceptedBody = null;

        page.on("request", (request) => {
          if (
            request.resourceType() === "xhr" ||
            request.resourceType() === "fetch"
          ) {
            console.log(`Intercepted request to: ${request.url()}`);
          }
          request.continue();
        });

        page.on("response", async (response) => {
          if (response.request().url().includes("/multi_search")) {
            try {
              const body = await response.text();
              lastInterceptedBody = body;
            } catch (error) {
              console.error(`Error reading response body: ${error}`);
            }
          }
        });

        await page.goto(url);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await browser.close();

        let parseLastInterceptedBody = JSON.parse(lastInterceptedBody);

        if (
          parseLastInterceptedBody.results &&
          parseLastInterceptedBody.results.length > 0 &&
          parseLastInterceptedBody.results[0].hits
        ) {
          const hits = parseLastInterceptedBody.results[0].hits;

          hits.forEach((hit) => {
            const recipe = {
              trackback: hit.document.trackback,
            };
            if (recipe.trackback.startsWith("/receita")) {
              allTrackbacks.push(recipe);
            }
          });
        } else {
          console.error("Invalid structure:", responseObject);
        }

        console.log(`Page ${searchPage} done`);
      }

      console.log("Size of allTrackbacks:", allTrackbacks.length);
      console.log("All pages done");
    } catch (error) {
      console.log("Error occurred:", error);
    } finally {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const filename = `trackbacks_${timestamp}.json`;
      const folderPath = path.join(__dirname, "..", "trackbacks");
      const filePath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, JSON.stringify(allTrackbacks));

      console.log("Data saved to:", filename);
    }

    return allTrackbacks;
  },

  async searchRecipesIndividual() {
    const folderPath = path.join(__dirname, "..", "trackbacks");
    const files = fs.readdirSync(folderPath);
    const latestFile = files.reduce((latest, file) => {
      const fileTimestamp = file.match(/trackbacks_(.*).json/)[1];
      if (!latest || fileTimestamp > latest) {
        return fileTimestamp;
      }
      return latest;
    }, null);

    const allTrackbacksPath = path.join(
      folderPath,
      `trackbacks_${latestFile}.json`
    );
    const allTrackbacks = JSON.parse(
      fs.readFileSync(allTrackbacksPath, "utf8")
    );
    const allRecipes = [];

    try {
      const browser = await puppeteer.launch();

      for (let i = 0; i < allTrackbacks.length; i++) {
        console.log(`Processing recipe ${i + 1} of ${allTrackbacks.length}`);

        const trackback = allTrackbacks[i].trackback;

        const url = `${constants.tg_base_url}${trackback}`;
        const fileName = trackback.split("/")[2] + ".json";

        if (!trackback.startsWith("/receita")) {
          console.log(`Invalid trackback: ${trackback}`);
          continue;
        }

        console.log(`URL: ${url}`);
        const page = await browser.newPage();

        await page.goto(url);

        page.setDefaultNavigationTimeout(0)

        await page.setViewport({ width: 1920, height: 1080 });

        const recipe = await page.evaluate((fileName) => {
          const recipeList = [];

          const recipeElements = document.querySelectorAll(".psB1-oM");

          recipeElements.forEach((element) => {
            recipeList.push(element.innerText);
          });

          const ingredients = recipeList[2].split("\n").slice(1);
          const prepare_mode = recipeList[4].split("\n").slice(1);

          const titleFull = document.querySelector(
            ".headerRecipeImage h1"
          ).innerText;

          const recipeJson = {
            title: titleFull,
            trackback: fileName,
            description: recipeList[0],
            ingredients: ingredients,
            prepare_mode: prepare_mode,
          };
          return recipeJson;
        }, JSON.stringify(fileName));

        allRecipes.push(recipe);

        await page.close();
      }

      await browser.close();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const filename = `all_recipes_${timestamp}.json`;
      const folderPath = path.join(__dirname, "..", "receitas");
      const filePath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, JSON.stringify(allRecipes));
    }

    return allRecipes;
  },

  async searchRecipesWithTrackbacks(trackbacks) {
    const allTrackbacks = trackbacks;
    const allRecipes = [];

    try {
      const browser = await puppeteer.launch();

      for (let i = 0; i < allTrackbacks.length; i++) {
        console.log(`Processing recipe ${i + 1} of ${allTrackbacks.length}`);

        const trackback = allTrackbacks[i].trackback;

        const url = `${constants.tg_base_url}${trackback}`;
        const fileName = trackback.split("/")[2] + ".json";
        const categories = allTrackbacks[i].categories ? allTrackbacks[i].categories : [];
        const recipe_yeld = allTrackbacks[i].recipe_yeld ? allTrackbacks[i].recipe_yeld : "";
        const total_time = allTrackbacks[i].total_time ? allTrackbacks[i].total_time : "";
        const relevance = allTrackbacks[i].relavance ? allTrackbacks[i].relavance : "";

        if (!trackback.startsWith("/receita")) {
          console.log(`Invalid trackback: ${trackback}`);
          continue;
        }

        console.log(`URL: ${url}`);
        const page = await browser.newPage();

        await page.goto(url);

        page.setDefaultNavigationTimeout(0)

        await page.setViewport({ width: 1920, height: 1080 });

        const recipe = await page.evaluate((fileName, categories, recipe_yeld, total_time, relevance) => {
          const recipeList = [];

          const recipeElements = document.querySelectorAll(".psB1-oM");

          recipeElements.forEach((element) => {
            recipeList.push(element.innerText);
          });

          const ingredients = recipeList[2].split("\n").slice(1);
          
          const cleanPreparationMode = (mode) => {
            const modeLines = mode.split("\n").slice(1); 
            const cleanedModeLines = [];

            for (let line of modeLines) {
              if (line.trim() === 'COMPRE O QUE VOCÊ PRECISA'  || line.trim() === "VEJA O VÍDEO" || line.trim().startsWith("VEJA ESTE E OUTROS PREPAROS")) {
                break;
              }
              cleanedModeLines.push(line);
            }

            return cleanedModeLines;
          };

          const prepare_mode = cleanPreparationMode(recipeList[4]);

          const titleFull = document.querySelector(
            ".headerRecipeImage h1"
          ).innerText;

          const recipeJson = {
            title: titleFull,
            trackback: fileName,
            categories: categories,
            recipe_yeld: recipe_yeld,
            total_time: total_time,
            relevance: relevance,
            description: recipeList[0],
            ingredients: ingredients,
            prepare_mode: prepare_mode,
          };
          return recipeJson;
        }, JSON.stringify(fileName), categories, JSON.stringify(recipe_yeld), JSON.stringify(total_time), JSON.stringify(relevance));
        allRecipes.push(recipe);

        await page.close();
      }

      await browser.close();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const filename = `all_recipes_${timestamp}.json`;
      const folderPath = path.join(__dirname, "..", "receitas");
      const filePath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, JSON.stringify(allRecipes));
    }

    return allRecipes;
  },

  async searchRecipesFullInformation() {
    const totalPages = 210;
    const allTrackbacks = [];

    try {
      for (let searchPage = 1; searchPage <= totalPages; searchPage++) {
        console.log(`Starting page ${searchPage}`);

        const url = `${constants.tg_base_url}/busca?query=&page=${searchPage}&configure%5BhitsPerPage%5D=20`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        let lastInterceptedBody = null;

        page.on("request", (request) => {
          if (
            request.resourceType() === "xhr" ||
            request.resourceType() === "fetch"
          ) {
            console.log(`Intercepted request to: ${request.url()}`);
          }
          request.continue();
        });

        page.on("response", async (response) => {
          if (response.request().url().includes("/multi_search")) {
            try {
              const body = await response.text();
              lastInterceptedBody = body;
            } catch (error) {
              console.error(`Error reading response body: ${error}`);
            }
          }
        });

        await page.goto(url);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await browser.close();

        let parseLastInterceptedBody = JSON.parse(lastInterceptedBody);

        if (
          parseLastInterceptedBody.results &&
          parseLastInterceptedBody.results.length > 0 &&
          parseLastInterceptedBody.results[0].hits
        ) {
          const hits = parseLastInterceptedBody.results[0].hits;

          hits.forEach((hit) => {
            const recipe = {
              trackback: hit.document.trackback,
              trackback: hit.document.trackback,
              categories: hit.document.categories,
              recipe_yeld: hit.document.recipe_yield_text,
              total_time: hit.document.total_time_text,
              relavance: hit.document.relevance,
            };
            if (recipe.trackback.startsWith("/receita")) {
              allTrackbacks.push(recipe);
            }
          });
        } else {
          console.error("Invalid structure:", responseObject);
        }

        console.log(`Page ${searchPage} done`);
      }

      console.log("Size of allTrackbacks:", allTrackbacks.length);
      console.log("All pages done");
    } catch (error) {
      console.log("Error occurred:", error);
    } finally {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const filename = `trackbacks_${timestamp}.json`;
      const folderPath = path.join(__dirname, "..", "trackbacks");
      const filePath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, JSON.stringify(allTrackbacks));

      console.log("Data saved to:", filename);
    }

    return allTrackbacks;
  },

};
