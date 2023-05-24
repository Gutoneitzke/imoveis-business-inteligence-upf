const puppeteer = require('puppeteer');

const url = "https://barcimoveis.com.br/busca/";
const links = [
  {
    slug: 'preco_medio_metro_quadrado',
    link: url
  },
  {
    slug: 'preco_medio_imovies',
    link: url
  },
  {
    slug: 'quantidade_imovies_total',
    link: url
  },
  {
    slug: 'quantidade_imovies_por_regiao',
    link: url
  },
  {
    slug: 'media_de_dormitorios',
    link: url
  },
  {
    slug: 'preco_aluguel_medio',
    link: url
  },
  {
    slug: 'taxa_juros',
    link: 'https://blog.nubank.com.br/taxa-selic/'
  },
]

async function getElements()
{
  console.log(links[0]['link']);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(links[0]['link']);

  const propertyList = await page.evaluate(() => {
    const propertyContainer = document.getElementById('conteudoImoveis');
    const propertyItems = Array.from(propertyContainer.getElementsByClassName('property-thumb-info'));
    const properties = [];

    propertyItems.forEach((item) => {
      const preco = item.querySelector('.preco').textContent;

      properties.push({ preco });
    });

    return properties;
  });

  console.log(propertyList);
};

getElements()