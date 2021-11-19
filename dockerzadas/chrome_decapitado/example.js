const puppeteer = require('puppeteer');

function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}

(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://xmas2021.sefod.eu/');
    await delay(10000);
    await page.evaluate(_ => {
    window.flag="flag{ThisOneWasEasy}";
    var texto = document.getElementById("message-input-box");
    var botao = document.getElementById("send-button");
    var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setValue.call(texto, '/nick botzadas');

    var e = new Event('change', { bubbles: true });
        texto.dispatchEvent(e);
        botao.click();
    });
//  await browser.close();
})();

