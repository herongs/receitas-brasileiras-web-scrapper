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
    const totalPages = 5;
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
          request.continue();
        });

        page.on("response", async (response) => {
          if (
            response.request().resourceType() === "xhr" ||
            response.request().resourceType() === "fetch"
          ) {
            const body = await response.text();
            lastInterceptedBody = body;
          }
        });

        await page.goto(url);
        await new Promise((resolve) => setTimeout(resolve, 7000));
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
};
