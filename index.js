const puppeteer = require("puppeteer-extra");
const path = require("path");

(async () => {
  console.log("✔️ Iniciando...");
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
    headless: false,
   slowMo: 100,
    userDataDir: "./user-data",
  });
  const page = await browser.newPage();
  for (const numeroCliente of numerosDeClienteFormateado) {
    await page.goto(
      "https://www.enel.cl/es/clientes/servicios-en-linea/copia-boleta.html"
    );
    console.log("⏳️ Cliente: " + numeroCliente);
    await page.type("#rutStep1", "111111111");
    await page.keyboard.press("Enter");
    await page.evaluate(() => document.querySelector("#button-step1").click());
    await page.type("#numero_cliente", numeroCliente);
    await page.keyboard.press("Enter");
    await page.evaluate(() => document.querySelector("#button-step2").click());
    await page.waitForNetworkIdle();

    await page.evaluate(() =>
      document.querySelector("#ckbxConsentAgeMsg").click()
    );
    await page.evaluate(() =>
      document.querySelector("#politica_privacidad0").click()
    );
    // await page.waitForNetworkIdle();
    // await page.waitForTimeout(10000);

    // await page.evaluate(() =>
    //   document.querySelector("#acceptTyC").click()
    // );
    await page.keyboard.press("Enter");

    await page.waitForTimeout(1000);
    await page.evaluate(() => document.querySelector("#ver_boleta").click());
    // console.log("ok1");
    // await page.waitForNetworkIdle();
    // console.log("✔️ Descargando boleta...");
    await page.waitForNetworkIdle();
    await page.waitForTimeout(1000);

    await page.evaluate(() =>
      document.querySelector("#downloadBoleta").click()
    );
    await page.waitForNetworkIdle();
    await page.waitForTimeout(3000);

    // await page.keyboard.press("Enter");
    // console.log("ok1")
    // await page.type("#rutCliente", "111111111");
    // await page.type("#nombreCliente", "Nombre");
    // await page.type("#apellidoCliente", "Apellido");
    // await page.type("#telefonoCliente", "951515577");
    // await page.type("#correoCliente", "nombre@apellido.cl");
    // await page.keyboard.press("Enter");
    // await page.waitForNetworkIdle();
    // await page.waitForSelector("#downloadBoleta");
    // await page.evaluate(() =>
    //   document.querySelector("#downloadBoleta").click()
    // );
  }
  await page.close();
  await browser.close();

  console.log("✔️ ✔️ Se ha finalizado.");
})();
