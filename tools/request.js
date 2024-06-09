/* eslint-disable no-return-assign */
/* eslint-disable global-require */
const constants = require("../route");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async searchRecipes(searchStr) {
    const url = `${constants.tg_base_url}/busca?query=${searchStr}`;
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
      if (
        response.request().resourceType() === "xhr" ||
        response.request().resourceType() === "fetch"
      ) {
        const body = await response.text();
        lastInterceptedBody = body; // Armazena o corpo da última resposta interceptada
      }
    });

    // Navegue para a página que você quer interceptar as requisições
    await page.goto(url);

    // Mantenha o navegador aberto por algum tempo para observar as requisições
    await new Promise((resolve) => setTimeout(resolve, 30000));

    await browser.close();

    return lastInterceptedBody;
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
            allTrackbacks.push(recipe);
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
      const filename = `all_trackbacks_${timestamp}_${uuidv4()}.json`;
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
    const allTrackbacks = require("../trackbacks/01_all_trackbacks_2024-06-09T20-53-29.559Z_28ae4178-801b-4e2f-b527-fc5e7d751b7a.json");
    const allRecipes = [];

    try {
      const browser = await puppeteer.launch();

      for (let i = 0; i < allTrackbacks.length; i++) {
        console.log(`Processing recipe ${i + 1} of ${allTrackbacks.length}`);

        const trackback = allTrackbacks[i].trackback;
        const url = `${constants.tg_base_url}${trackback}`;
        const fileName  = trackback.split("/")[2] + ".json";

        console.log(`URL: ${url}`);
        const page = await browser.newPage();

        await page.goto(url);

        await page.setViewport({ width: 1920, height: 1080 });

        const recipe = await page.evaluate((fileName) => {
          const recipeList = [];
        
          const recipeElements = document.querySelectorAll(".psB1-oM");
          recipeElements.forEach((element) => {
            recipeList.push(element.innerText);
          });

          const ingredients = recipeList[2].split("\n").slice(1);
          const prepare_mode = recipeList[4].split("\n").slice(1);

          const recipeJson = {
            title: fileName,
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
      const filename = `all_recipes_${timestamp}_${uuidv4()}.json`;
      const folderPath = path.join(__dirname, "..", "recipes");
      const filePath = path.join(folderPath, filename);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(filePath, JSON.stringify(allRecipes));
    }
    
    return "All recipes done!";
  },
};
