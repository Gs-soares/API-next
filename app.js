const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function createHTML(dataHTML){
  return new Promise((resolve, reject) => {
      fs.readFile(dataHTML, 'utf8', (err, data) => {
          if(err) {
              reject(err);
          }
          resolve(data);
      });
  });
}

const app = express();

const PORT = process.env.PORT || 8877;

app.listen(PORT, () => {
    console.log(PORT)
})

app.get('/', (req, res) => {
    res.json({
        msg: 'ok'
    })
})

app.get('/:name', async (req, res) => {
    console.time()
    const id = req.params.name;
    if(fs.existsSync(`pages/${id}.html`)){
      console.log('passou aqui')
      return res.sendFile(path.join(__dirname, `/pages/${id}.html`))
    }
    console.log('baixando html')
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://pt.wikipedia.org/wiki/${id}`);
    
    const pageData = await page.evaluate(() => {
      return document.querySelector('#bodyContent').innerText;
    });
    // `${document.querySelector('#firstHeading').innerText} 
    // ${document.querySelector('#bodyContent').innerHTML}`
    await browser.close();

    fs.writeFile(`pages/${id}.html`, JSON.stringify(pageData), (err) => {
      if(err) throw err
      console.log('salvo')
    })

    console.timeEnd();
  
    return res.sendFile(path.join(__dirname, `/pages/${id}.html`))
  });
  
  
  app.listen(3000);