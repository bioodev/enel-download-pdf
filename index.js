const puppeteer = require("puppeteer-extra");
const path = require("path");

(async () => {
  console.log("✔️ Iniciando...")
  const numerosDeCliente = require("./clientes.json");
  const numerosDeClienteFormateado = numerosDeCliente.map((item) => {
    return item.replace("-", "");
  });
  puppeteer.use(
    require("puppeteer-extra-plugin-user-preferences")({
      userPrefs: {
        download: {
          prompt_for_download: false,
          default_directory: path.join(`${process.cwd()}`, "pdf"),
        },
        plugins: {
          always_open_pdf_externally: true,
        },
      },
    })
  );
  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: "new",
    userDataDir: "./user-data",
  });
  const page = await browser.newPage();
  for (const numeroCliente of numerosDeClienteFormateado) {
    await page.goto(
      "https://www.enel.cl/es/clientes/servicios-en-linea/copia-boleta.html"
    );
    console.log("⏳️ Cliente: " + numeroCliente);
    await page.type("#numeroCliente", numeroCliente);
    await page.type("#rutCliente", "111111111");
    await page.type("#nombreCliente", "Nombre");
    await page.type("#apellidoCliente", "Apellido");
    await page.type("#telefonoCliente", "951515577");
    await page.type("#correoCliente", "nombre@apellido.cl");
    await page.keyboard.press("Enter");
    await page.waitForNetworkIdle();
    await page.waitForSelector("#downloadBoleta");
    await page.evaluate(() =>
      document.querySelector("#downloadBoleta").click()
    );
    await page.waitForNetworkIdle();
    console.log("✔️ Descargando boleta...");
    await page.waitForTimeout(3000);
  }
  await page.close();
  await browser.close();

  console.log("✔️ ✔️ Se ha finalizado.")
})();