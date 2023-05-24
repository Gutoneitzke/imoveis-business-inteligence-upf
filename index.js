const puppeteer = require('puppeteer');

const url = "https://barcimoveis.com.br/busca/";
const links = [
  {
    slug: 'preco_medio_metro_quadrado',
    link: url,
    data: [] // ok - só falta pegar todos
  },
  {
    slug: 'quantidade_imovies_total',
    link: url,
    data: [] // ok
  },
  {
    slug: 'preco_medio_imovies',
    link: url,
    data: [] // ok - só falta pegar todos
  },
  {
    slug: 'quantidade_imovies_por_regiao',
    link: url,
    data: [] // ok - só falta pegar todos
  },
  {
    slug: 'media_de_dormitorios',
    link: url,
    data: [] // ok - só falta pegar todos
  },
  {
    slug: 'preco_aluguel_medio',
    link: url,
    data: [] // ok - só falta pegar todos
  },
  {
    slug: 'taxa_juros',
    link: 'https://blog.nubank.com.br/taxa-selic/',
    data: []
  },
]

async function getElements()
{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Pegando infos dos imoveis
  let element0 = links[0]
  console.log("LOADING - Pegando infos dos imoveis",element0.link);
  await page.goto(element0.link);

  element0.result = await page.evaluate(() => {
    const propertyContainer = document.getElementById('conteudoImoveis');
    const propertyItems = Array.from(propertyContainer.getElementsByClassName('property-thumb-info'));
    const properties = [];

    propertyItems.forEach((item) => {
      const preco = item.querySelector('.preco').textContent;
      const estado = item.querySelector('.bairro').textContent.replace(/.*?(RS|SC).*/, "$1").trim();
      const status = item.querySelector('.status').textContent.replace(" - ","");
      const metragemTotal = item.querySelector('[data-original-title="Área total"]')?.textContent.trim();
      const metragemPrivativa = item.querySelector('[data-original-title="Área Privativa"]')?.textContent.trim();
      const dormitorios = item.querySelector('[data-original-title="Dormitório"]')?.textContent.trim();

      properties.push({ preco, estado, status, metragemTotal, metragemPrivativa, dormitorios });
    });

    return properties;
  });

  console.log("Informações dos imóveis: ",element0.result);

  // Quantidade de imovies - Total
  // let element1 = links[1]
  // console.log("LOADING - Quantidade de imovies - Total: ",element1.link);
  // await page.goto(element1.link);

  // element1.result = await page.evaluate(() => {
  //   const propertyContainer = document.querySelector('.listing-header');
  //   return propertyContainer.querySelector('h1').textContent.trim();
  // });

  // console.log("Quantidade de imovies - Total: ",element1.result);
  
};

getElements()