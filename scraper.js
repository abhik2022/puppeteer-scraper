const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    const results = [];
    const products = document.querySelectorAll('.product-item');
    products.forEach((product) => {
      const name = product.querySelector('.product-name').innerText;
      const price = product.querySelector('.product-price').innerText;
      results.push({ name, price });
    });
    return results;
  });

  await browser.close();
  return data;
}

async function saveDataToFile(data, outputPath) {
  fs.writeFile(outputPath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`Data saved to ${outputPath}`);
    }
  });
}

// Construct file URL for local index.html
const filePath = path.resolve(__dirname, 'index.html');
const fileUrl = `file://${filePath}`;
const outputPath = 'products.json';

scrapeWebsite(fileUrl)
  .then((data) => saveDataToFile(data, outputPath))
  .catch((error) => console.error('Error:', error));
