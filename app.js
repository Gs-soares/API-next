const express = require("express");
const puppeteer = require("puppeteer");
const wikipedia = require("wikipedia-js");
const fs = require("fs");
const path = require("path");

function createHTML(dataHTML) {
  return new Promise((resolve, reject) => {
    fs.readFile(dataHTML, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

const app = express();

const PORT = process.env.PORT || 8877;

app.listen(PORT, () => {
  console.log(PORT);
});

app.get("/", (req, res) => {
  res.json({
    msg: "ok",
  });
});

app.get("/teste", async (req, res) => {
  const options = {query: "naruto", format: "html", sumaryOnly: false, lang: "fr"}
  wikipedia.searchArticle(options, (err, htmlWikiText) => {
    if(err){
      console.log("Erro", options.query, err)
    }
    console.log(options.query, htmlWikiText)
    res.send(htmlWikiText)
  })
})

app.get("/:name", async (req, res) => {
  const id = req.params.name;
  if (fs.existsSync(`pages/${id}.html`)) {
    return res.sendFile(path.join(__dirname, `/pages/${id}.html`));
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://pt.wikipedia.org/wiki/${id}`);

  const pageData = await page.evaluate(() => {
    return document.querySelector("#content").innerText;
  });

  await browser.close();

  var originalWord = pageData;
  if(originalWord.includes("\n")){
    var newWord = originalWord.replaceAll("\n", " ");
    newWord = newWord.replaceAll("\t", " ");
  }

  fs.writeFile(`pages/${id}.html`, JSON.stringify(newWord), (err) => {
    if (err) throw err;
    console.log("salvo");
  });

  // fs.writeFile(`pages/${id}.html`, JSON.stringify(pageData), (err) => {
  //   if(err) throw err
  //   console.log('salvo')
  // })
  return res.sendFile(path.join(__dirname, `/pages/${id}.html`));
});

app.listen(3000);
