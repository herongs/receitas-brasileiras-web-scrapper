/* eslint-disable no-return-assign */
/* eslint-disable global-require */
const constants = require("../route");
const puppeteer = require("puppeteer");

module.exports = {
  async searchRecipes(searchStr) {
    const url = `${constants.tg_base_url}/busca?query=${searchStr}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Configura o interceptador de solicitações
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
};
