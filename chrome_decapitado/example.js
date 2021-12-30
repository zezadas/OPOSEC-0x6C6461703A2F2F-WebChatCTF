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
    if (process.env.ISDEBUG === "true"){
            url = 'http://clientzadas:8080';
    }
    else{
            url = 'http://xmas2021.sefod.eu';
    }
    console.log(url);
    await page.goto(url);
    await delay(15000);
    console.log("continuing");
    await page.evaluate(_ => {
    window.flag="flag{This_Flag_Is_Easier_Than_Rabanadas}";
    
    var result = Module.ccall(
            'SetTheFlag',       // name of C function
            null,       // return type
            ['string'], // argument types
            ["flag{TheresNoXmasWithoutArrozDoce}"] // ["AAAABBBBCCCCDDDDSanta<3Wasm"]      // arguments
    );



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

