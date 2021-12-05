const puppeteer = require('puppeteer');

function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}

(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await delay(5000);
    var url="";
    if (process.env.SOCKETURL === ""){
            url = 'http://xmas2021.sefod.eu';
    }
    else{
            url = 'http://clientzadas:8080';
    }
    console.log(url);
    await page.goto(url);
    await delay(5000);
    console.log("continuing");
    await page.evaluate(_ => {
    window.flag="flag{This_Flag_Is_Easier_Than_Rabanadas}";
    var texto = document.getElementById("message-input-box");
    var botao = document.getElementById("send-button");
    var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setValue.call(texto, '/nick Santa');

    var e = new Event('change', { bubbles: true });
        texto.dispatchEvent(e);
        botao.click();
    });
    page.on('console', msg => process_logs(msg.text()));
//  await browser.close();
})();

function process_logs(msgzadas){
    //var fromUser
    //var toUser
    console.log(msgzadas);
}

